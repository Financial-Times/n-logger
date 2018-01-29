import sinon from 'sinon';
import chai from 'chai';
chai.should();

import SplunkHEC from '../../../dist/lib/transports/splunkHEC';

describe('SplunkHEC', () => {

	it('should exist', () => {
		SplunkHEC.should.exist;
	});

	it('should be able to instantiate', () => {
		const splunkHECTransport = new SplunkHEC();
		splunkHECTransport.should.exist;
	});

	describe('log', () => {
		it('should send a message to Splunk', () => {
			const splunkHECTransport = new SplunkHEC();

			return splunkHECTransport.log('error', 'a message', { field: 'value' });
		});
	});

});
