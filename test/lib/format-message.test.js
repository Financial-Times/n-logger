import chai from 'chai';
chai.should();
import formatMessage from '../../src/lib/format-message';

describe('Format Message', () => {

	it('should exist', () => {
		formatMessage.should.exist;
	});

	it('should replace double-quotes with single-quotes', () => {
		const message = 'an "error" occurred';
		formatMessage(message).should.equal('an \'error\' occurred');
	});

	it('should understand a message that\'s an Error', () => {
		class MyError extends Error { };
		const message = new MyError('whoops!');
		formatMessage(message).should.startWith('error_message=whoops! error_name=Error error_stack="Error: whoops!\n    at');
	});

});
