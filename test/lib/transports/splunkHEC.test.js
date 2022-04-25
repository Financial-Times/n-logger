const chai = require('chai');
const { expect } = chai;
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

		it('should send a log to Splunk', () => {
			nock('https://http-inputs-financialtimes.splunkcloud.com')
				.post('/services/collector/event')
				.reply(201, { text: 'Successful request', code: 0 });

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport
				.log('error', 'a message', { field: 'value' })
				.then((res) => res.json())
				.then((json) => {
					json.text.should.equal('Successful request');
				});
		});

		it('should not throw exceptions when Splunk is down', () => {
			nock('https://http-inputs-financialtimes.splunkcloud.com')
				.post('/services/collector/event')
				.reply(500);

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('error', 'a message', { field: 'value' });
		});

		it('should not throw exceptions when Splunk does not accept the request', () => {
			nock('https://http-inputs-financialtimes.splunkcloud.com')
				.post('/services/collector/event')
				.reply(400);

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('info', 'a message', { field: 'value' });
		});

		it('should send a log if data is circularly referenced', () => {
			nock('https://http-inputs-financialtimes.splunkcloud.com')
				.post('/services/collector/event')
				// NOTE: Returning requestBody for further tests
				.reply(201, (uri, requestBody) => {
					return requestBody;
				});

			const splunkHECTransport = new SplunkHEC();
			const circularData = { field: 'value' };
			circularData.circularData = circularData;
			return (
				splunkHECTransport
					.log('info', 'a message', circularData)
					// Process JSON, to check returned requestBody
					.then((res) => res.json())
					.then((data) => {
						expect(data).to.be.an('object');
					})
			);
		});

		it('sent log body should be JSON.parse-able', () => {
			nock('https://http-inputs-financialtimes.splunkcloud.com')
				.post('/services/collector/event')
				// NOTE: Returning requestBody for further tests
				.reply(201, (uri, requestBody) => {
					return requestBody;
				});

			const splunkHECTransport = new SplunkHEC();
			return (
				splunkHECTransport
					.log('info', 'a message', { field: 'value' })
					// Process JSON, to check returned requestBody
					.then((res) => res.json())
					.then((data) => {
						expect(data).to.be.an('object');
					})
			);
		});
	});
});
