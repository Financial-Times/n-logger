/* global process */
'use strict';

const request = require('request');
const https = require('https');
const httpsAgent = new https.Agent({ keepAlive: true });

const url = process.argv[2];

const onMessage = (message) => request({
	method : 'POST',
	url : url,
	followRedirect : true,
	strictSSL: false,
	pool : httpsAgent,
	body : message
});

process.on('message', onMessage);
