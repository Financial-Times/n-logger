/* global process */
'use strict';

const winston = require('winston');
const request = require('request');
const formatMeta = require('../format-meta');

class Splunk extends winston.Transport {
	constructor(options) {
		super(options);
		this.name = 'splunk';
	}

	log(level, msg, meta, callback) {
		const formattedMsg = msg.replace(/"/g, '\'');
		const formattedMeta = formatMeta(meta);
		request({
			method : 'POST',
			url : `${process.env.SPLUNK_URL}ft-next-front-page`,
			followRedirect : true,
			strictSSL: false,
			body : `${formattedMsg} ${formattedMeta}`
		}, function () {
			callback(null, true);
		});
	}
}

module.exports = Splunk;
