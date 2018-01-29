import winston from 'winston';

const https = require('https');

class SplunkHEC extends winston.Transport {

	log (level, message, meta) {
		const httpsAgent = new https.Agent({ keepAlive: true });

		return fetch('https://http-inputs-financialtimes.splunkcloud.com:443/services/collector/event', {
			method : 'POST',
			headers: {
				'Authorization': `Splunk ${process.env.SPLUNK_HEC_TOKEN}`
			},
			followRedirect : true,
			strictSSL: false,
			pool : httpsAgent,
			body : message
		}).catch(() => {});
	};

}
export default SplunkHEC;
