const chai = require('chai');
const { expect } = chai;
chai.should();

const proxyquire = require('proxyquire');

const formatter = () => {
	return 'a message field=value level=error';
};

const fetchMock = require('fetch-mock');

const SplunkHEC = proxyquire('../../../dist/lib/transports/splunkHEC', {
	'../formatter': formatter,
	'node-fetch': fetchMock.sandbox()
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
			fetchMock.resetBehavior();
		});

		it('should send a log to Splunk', () => {
			fetchMock.post('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', {
				status: 201,
				body: { text: 'Successful request', code: 0 }
			});

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('error', 'a message', { field: 'value' })
				.then(res => res.json())
				.then(json => {
					json.text.should.equal('Successful request');
				});
		});

		it('should not throw exceptions when Splunk is down', () => {
			fetchMock.post('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', {
				status: 500
			});

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('error', 'a message', { field: 'value' });
		});

		it('should not throw exceptions when Splunk does not accept the request', () => {
			fetchMock.post('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', {
				status: 400
			});

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('info', 'a message', { field: 'value' });
		});

		it('should send a log if data is circularly referenced', () => {
			fetchMock.post('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', (url, {body}) => {
				return {
					status: 201,
					// NOTE: Returning requestBody for further tests
					body
				};
			});

			const splunkHECTransport = new SplunkHEC();
			const circularData = { field: 'value' };
			circularData.circularData = circularData;
			return splunkHECTransport.log('info', 'a message', circularData)
				// Process JSON, to check returned requestBody
				.then(res => res.json())
				.then(data => {
					expect(data).to.be.an('object');
				});;
		});

		it('sent log body should be JSON.parse-able', () => {
			fetchMock.post('https://http-inputs-financialtimes.splunkcloud.com/services/collector/event', (url, {body}) => {
				return {
					status: 201,
					// NOTE: Returning requestBody for further tests
					body
				};
			});

			const splunkHECTransport = new SplunkHEC();
			return splunkHECTransport.log('info', 'a message', { field: 'value' })
				// Process JSON, to check returned requestBody
				.then(res => res.json())
				.then(data => {
					expect(data).to.be.an('object');
				});
		});
	});

});
