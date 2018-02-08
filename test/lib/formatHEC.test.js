const chai = require('chai');
chai.should();
const expect = chai.expect;

import formatHEC from '../../dist/lib/formatHEC';

describe('FormatHEC', () => {

	it('should exist', () => {
		formatHEC.should.exist;
	});

	it('should format the data', () => {
		const options = {
			level: 'info',
			message: 'Hello world',
			meta: {
				event: 'test'
			}
		};

		expect(formatHEC(options)).to.deep.equal({
			level: 'info',
			message: 'Hello world',
			event: 'test'
		});
	});

});
