'use strict';

const fork = require('child_process').fork;
const path = require('path');
const winston = require('winston');
const formatMeta = require('../format-meta');

class Splunk extends winston.Transport {

	constructor(opts) {
		super(opts);
		this.name = 'splunk';
		if (opts && opts.agent) {
			this.agent = opts.agent;
			this.agent.url = opts.splunkUrl;
		} else {
			this.agent = fork(path.resolve(__dirname, '..', 'agent.js'), [opts.splunkUrl]);
		}
	}

	log(level, msg, meta, callback) {
		const formattedMsg = msg.replace(/"/g, '\'');
		const formattedMeta = formatMeta(meta);
		this.agent.send(`${formattedMsg} ${formattedMeta}`, (err) => callback(err, true));
	}

}

module.exports = Splunk;
