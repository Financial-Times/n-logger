/* global process, __dirname */
'use strict';

const fork = require('child_process').fork;
const path = require('path');
const winston = require('winston');
const formatMeta = require('../format-meta');

class Splunk extends winston.Transport {

	constructor(opts) {
		super(opts);
		this.appName = opts.appName;
		console.log(`${process.env.SPLUNK_URL}${this.appName}`);
		this.agent = (opts && opts.agent) || fork(path.resolve(__dirname, '..', 'agent.js'), [`${process.env.SPLUNK_URL}${this.appName}`]);
	}

	log(level, msg, meta, callback) {
		const formattedMsg = msg.replace(/"/g, '\'');
		const formattedMeta = formatMeta(meta);
		this.agent.send(`${formattedMsg} ${formattedMeta}`, (err) => callback(err, true));
	}

}

module.exports = Splunk;
