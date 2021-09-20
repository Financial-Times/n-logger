import winston from 'winston';
import nodeFetch from 'node-fetch';
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
	// name that Winston refers to the transport by
	get name () {
		return 'splunkHEC';
	}

	setSystemCode (systemCode) {
		this._systemCode = systemCode;
	}

	get systemCode () {
		if(this._systemCode) {
			return this._systemCode;
		} else if(process.env.SYSTEM_CODE) {
			// fall back to legacy environment variable with a warning
			if(!this.warnedSystemCode) {
				console.warn('n-logger Splunk transport received the system code from the SYSTEM_CODE environment variable, which is deprecated. Call logger.setSystemCode instead');
				this.warnedSystemCode = true;
			}

			return process.env.SYSTEM_CODE;
		} else {
			throw new Error('You must set the systemCode option to a valid Biz Ops system code (call logger.setSystemCode) to use the Splunk transport.');
		}
	}

	log (level, message, meta) {
		const httpsAgent = new https.Agent({ keepAlive: true });
		const formattedMessage = formatHEC({ level, message, meta });

		const data = {
			'time': Date.now(),
			'host': 'localhost',
			'source': `/var/log/apps/heroku/ft-${this.systemCode}.log`,
			'sourcetype': process.env.SPLUNK_SOURCETYPE || '_json',
			'index': process.env.SPLUNK_INDEX || 'heroku',
			'event': formattedMessage
		};

		return (global.fetch || nodeFetch)('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', {
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
