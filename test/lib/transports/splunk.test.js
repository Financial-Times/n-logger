'use strict';

require('chai').should();
const sinon = require('sinon');
const Splunk = require('../../../lib/transports/splunk');

describe('Splunk', () => {

	it('should exist', () => {
		Splunk.should.exist;
	});

	it('should be able to instantiate', () => {
		const splunkTransport = new Splunk({ splunkUrl: 'http://splunk.ft.com/ft-next-front-page' });
		splunkTransport.should.exist;
		splunkTransport.agent.kill();
	});

	it('should send the correct message to the agent', () => {
		const mockAgent = {
			send: sinon.spy()
		};
		const splunkTransport = new Splunk({ splunkUrl: 'http://splunk.ft.com/ft-next-front-page', agent: mockAgent });
		mockAgent.url = 'http://splunk.ft.com/ft-next-front-page';
		splunkTransport.log('error', 'a message', { field: 'value'});
		mockAgent.send.called.should.be.true;
		mockAgent.send.calledWith('a message field=value').should.be.true;
	});

});
