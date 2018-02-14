const chai = require('chai');
chai.should();
const expect = chai.expect;

import formatHEC from '../../dist/lib/formatHEC';

describe('FormatHEC', () => {

	it('should exist', () => {
		formatHEC.should.exist;
	});

	it('should format all data options', () => {
		const options = {
			level: 'info',
			message: 'Hello world',
			meta: { event: 'TEST' }
		};

		expect(formatHEC(options)).to.deep.equal({
			level: 'info',
			message: 'Hello world',
			event: 'TEST'
			});
	});

	it('should handle data containing an error', () => {
		const err = new Error('This is an error');
		const options = {
			level: 'error',
			meta: { event: 'TEST_ERROR', err }
		};

		expect(formatHEC(options)).to.deep.equal({
			level: 'error',
			event: 'TEST_ERROR', err
			});
	});

	it('should handle no meta data ', () => {
		const options = {
			level: 'info',
			message: 'a message'
		};

		expect(formatHEC(options)).to.deep.equal({
			level: 'info',
			message: 'a message'
		});
	});

	it('should handle no message', () => {
		const count = 10;
		const options = {
			level: 'info',
			meta: { event: 'TEST', count }
		};

		expect(formatHEC(options)).to.deep.equal({
			level: 'info',
			event: 'TEST',
			count: 10
			});
	});

});
