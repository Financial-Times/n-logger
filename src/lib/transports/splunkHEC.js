import winston from 'winston';
import stringify from 'json-stringify-safe';
import formatHEC from '../formatHEC';

const https = require('https');

const throwIfNotOk = res => {
	const { ok, status, url } = res;
	if (!ok) {
		return res.json()
			.then(errorBody => {
				console.error('Fetch error:', status, url, errorBody); // eslint-disable-line no-console
				throw errorBody;
			});
	}
	return res;
};

class SplunkHEC extends winston.Transport {

	log (level, message, meta) {
		const httpsAgent = new https.Agent({ keepAlive: true });
		const formattedMessage = formatHEC({ level, message, meta });

		const data = {
			'time': Date.now(),
			'host': 'localhost',
			'source': `/var/log/apps/heroku/ft-${process.env.SYSTEM_CODE}.log`,
			'sourcetype': process.env.SPLUNK_SOURCETYPE || '_json',
			'index': process.env.SPLUNK_INDEX || 'heroku',
			'event': formattedMessage
		};

		return fetch('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', {
			method: 'POST',
			headers: {
				'Authorization': `Splunk ${process.env.SPLUNK_HEC_TOKEN}`
			},
			pool: httpsAgent,
			timeout: 3000,
			body: stringify(data)
		})
			.then(throwIfNotOk)
			.catch((error) => {
				/* eslint no-console: 0 */
				console.log('Error logging to splunk', error, data);
			});
	};

}

export default SplunkHEC;
