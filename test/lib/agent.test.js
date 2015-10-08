'use strict';

require('chai').should();
const fork = require('child_process').fork;
const path = require('path');
const http = require('http');

describe('Agent', () => {
	const port = '6666';
	const host = `http://localhost:${port}`;
	const appName = 'ft-next-front-page';

	let promise;
	let server;
	let requestData = '';
	let agent;

	beforeEach(() => {
		promise = new Promise(resolve => {
			server = http.createServer(req => {
				req.on('data', function(chunk) {
					requestData += chunk.toString();
				});
				req.on('end', function(){
					resolve(requestData);
				});
			});
			server.listen(port);
		});
		agent = fork(path.resolve(__dirname, '..', '..', 'lib/agent.js'), [`${host}/${appName}`]);
	});

	afterEach(done => {
		agent.kill();
		server.close(done);
	});

	it('should exist', () => {
		agent.should.exist;
	});

	it('should listen to sent messages', () => {
		const msg = 'Hello, world';
		agent.send(msg);

		return promise.then(data => data.should.equal(msg));
	});

});
