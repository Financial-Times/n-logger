import { fork } from 'child_process';
import path from 'path';
import winston from 'winston';
import formatMessage from '../format-message';
import formatMeta from '../format-meta';

class Splunk extends winston.Transport {

	constructor (opts) {
		super(opts);
		this.name = 'splunk';
		if (opts && opts.agent) {
			this.agent = opts.agent;
			this.agent.url = opts.splunkUrl;
		} else {
			this.agent = fork(path.resolve(__dirname, '..', 'agent.js'), [opts.splunkUrl]);
		}
	}

	log (level, msg, meta, callback) {
		const formattedMsg = formatMessage(msg);
		const formattedMeta = formatMeta(meta);
		this.agent.send(`${formattedMsg} ${formattedMeta}`, (err) => callback(err, true));
	}

}

export default Splunk;
