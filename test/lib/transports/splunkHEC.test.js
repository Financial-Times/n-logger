const chai = require('chai');
chai.should();

const nock = require('nock');
const proxyquire = require('proxyquire');

const formatter = () => {
	return 'a message field=value level=error';
};

const SplunkHEC = proxyquire('../../../dist/lib/transports/splunkHEC', {
	'../formatter': formatter
}).default;

describe('SplunkHEC', () => {

	it('should exist', () => {
		SplunkHEC.should.exist;
	});

	it('should be able to instantiate', () => {
		const splunkHECTransport = new SplunkHEC();
		splunkHECTransport.should.exist;
	});

	describe('log', () => {

		afterEach(() => {
			nock.cleanAll();
		});

		it('should return an object', () => {
			nock('https://http-inputs-financialtimes.splunkcloud.com')
				.post('/services/collector/event')
				.reply(201, { text: 'Successful request', code: 0 });

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('error', 'a message', { field: 'value' })
				.then(res => {
					res.text.should.equal('Successful request');
				});
		});

		it('should not throw exceptions', () => {
			nock('https://http-inputs-financialtimes.splunkcloud.com')
				.post('/services/collector/event')
				.reply(500);

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('error', 'a message', { field: 'value' });
		});
	});

	describe('when Splunk is not accepting requests', () => {

		it('should not throw exceptions', () => {
			nock('https://http-inputs-financialtimes.splunkcloud.com')
				.post('/services/collector/event')
				.reply(400);

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('info', 'a message', { field: 'value' });
		});
	});

});
