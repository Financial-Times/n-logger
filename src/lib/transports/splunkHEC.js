import winston from 'winston';
import formatter from '../formatter';

const https = require('https');
const fetch = require('@financial-times/n-fetch');

class SplunkHEC extends winston.Transport {

	log (level, message, meta) {
		const formattedMessage = formatter({ level, message, meta, splunkFriendly: true });
		const httpsAgent = new https.Agent({ keepAlive: true });

		const data = {
			'time': Date.now(),
			'host': 'localhost',
			'source': `/var/log/apps/heroku/${process.env.SYSTEM_CODE}.log`,
			'sourcetype': 'heroku:drain',
			'index': 'heroku',
			'event': { formattedMessage }
		};

		return fetch('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', {
			method : 'POST',
			headers: {
				'Authorization': `Splunk ${process.env.SPLUNK_HEC_TOKEN}`
			},
			followRedirect : true,
			strictSSL: false,
			pool : httpsAgent,
			body : JSON.stringify(data)
		}).catch(() => {});
	};

}

export default SplunkHEC;
