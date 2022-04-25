import chai from 'chai';
import chaiString from 'chai-string';
chai.should();
chai.use(chaiString);

import formatter from '../../dist/lib/formatter';

describe('Formatter', () => {
	it('should exist', () => {
		formatter.should.exist;
	});

	it('should format the message', () => {
		const options = { message: 'a message' };
		formatter(options).should.equal('a message');
	});

	it('should handle non-string message', () => {
		const options = { message: 1234 };
		const formatted = formatter(options);
		formatted.should.be.a('string');
		formatted.should.equal('1234');
	});

	it('should format the level as a field', () => {
		const options = { level: 'error' };
		formatter(options).should.equal('level=error');
	});

	it('should format the meta as fields', () => {
		const options = { meta: { foo: 'bar' } };
		formatter(options).should.equal('foo=bar');
	});

	it('should format all options', () => {
		const options = {
			message: 'a message',
			level: 'error',
			meta: { foo: 'bar' }
		};
		formatter(options).should.equal('a message foo=bar level=error');
	});

	it('should be able to make splunk friendly', () => {
		const options = {
			message: 'a "message\nfor you"',
			meta: {
				foo: 'here\'s a quote"'
			},
			splunkFriendly: true
		};
		formatter(options).should.equal(
			"a 'message	for you' foo=\"here's a quote'\""
		);
	});
});
