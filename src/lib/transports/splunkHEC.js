import winston from 'winston';
import formatHEC from '../formatHEC';
const https = require('https');

class SplunkHEC extends winston.Transport {

	log (level, message, meta) {
		const httpsAgent = new https.Agent({ keepAlive: true });
		const formattedMessage = formatHEC({ level, message, meta });
		
		// Allows the heroku prefix to be something other than ft- (like ip-)
		// Omits the prefix altogether if the env var is set to an empty string
		const herokuPrefix = process.env.HEROKU_PREFIX === undefined ? 'ft-' : process.env.HEROKU_PREFIX;
		
		const data = {
			'time': Date.now(),
			'host': 'localhost',
			'source': `/var/log/apps/heroku/${herokuPrefix}${process.env.SYSTEM_CODE}.log`,
			'sourcetype': '_json',
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
			body: JSON.stringify(data)
		}).catch(() => {});
	};

}

export default SplunkHEC;
