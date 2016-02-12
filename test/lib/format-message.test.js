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

});
