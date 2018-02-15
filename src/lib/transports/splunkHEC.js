import winston from 'winston';
import formatHEC from '../formatHEC';
const https = require('https');

class SplunkHEC extends winston.Transport {

	log (level, message, meta) {
		const httpsAgent = new https.Agent({ keepAlive: true });
		const formattedMessage = formatHEC({ level, message, meta });

		const data = {
			'time': Date.now(),
			'host': 'localhost',
			'source': `/var/log/apps/heroku/ft-${process.env.SYSTEM_CODE}.log`,
			'sourcetype': '_json',
			'index': 'heroku',
			'event': formattedMessage
		};

		return fetch('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', {
			method: 'POST',
			headers: {
				'Authorization': `Splunk ${process.env.SPLUNK_HEC_TOKEN}`
			},
			pool: httpsAgent,
			body: JSON.stringify(data)
		}).catch(() => {});
	};

}

export default SplunkHEC;
