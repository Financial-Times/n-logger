'use strict';

const fork = require('child_process').fork;
const path = require('path');
const winston = require('winston');
const formatMeta = require('../format-meta');

class Splunk extends winston.Transport {

	constructor(opts) {
		super(opts);
		this.name = 'splunk';
		const url = `${opts.splunkUrl}${opts.appName}`;
		if (opts && opts.agent) {
			this.agent = opts.agent;
			this.agent.url = url;
		} else {
			this.agent = fork(path.resolve(__dirname, '..', 'agent.js'), [url]);
		}
	}

	log(level, msg, meta, callback) {
		const formattedMsg = msg.replace(/"/g, '\'');
		const formattedMeta = formatMeta(meta);
		this.agent.send(`${formattedMsg} ${formattedMeta}`, (err) => callback(err, true));
	}

}

module.exports = Splunk;
