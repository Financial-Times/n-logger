import chai from 'chai';
chai.should();
import sinon from 'sinon';
import Splunk from '../../../src/lib/transports/splunk';

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
		mockAgent.url.should.equal('http://splunk.ft.com/ft-next-front-page');
		splunkTransport.log('error', 'a message', { field: 'value'});
		mockAgent.send.called.should.be.true;
		mockAgent.send.calledWith('a message level=error field=value').should.be.true;
	});

	it('should handle no message', () => {
		const mockAgent = {
			send: sinon.spy()
		};
		const splunkTransport = new Splunk({ splunkUrl: 'http://splunk.ft.com/ft-next-front-page', agent: mockAgent });
		splunkTransport.log('error', '');
		mockAgent.send.calledWith('level=error').should.be.true;
	});

});
