import chai from 'chai';
chai.should();

import { formatError, formatMessage, formatFields, formatValue } from '../../build/lib/format';

describe('Format', () => {

	describe('Error', () => {

		it('should exist', () => {
			formatError.should.exist;
		});

	});

	describe('Message', () => {

		it('should exist', () => {
			formatMessage.should.exist;
		});

		it('should replace double-quotes with single-quotes', () => {
			const message = 'an "error" occurred';
			formatMessage(message).should.equal('an \'error\' occurred');
		});

	});

	describe('Fields', () => {

		it('should exist', () => {
			formatFields.should.exist;
		});

		it('should format fields', () => {
			const meta = {
				app: 'ft-next-front-page'
			};
			formatFields(meta).should.equal('app=ft-next-front-page');
		});

		it('should format multiple fields', () => {
			const meta = {
				app: 'ft-next-front-page',
				level: 'error'
			};
			formatFields(meta).should.equal('app=ft-next-front-page level=error');
		});

		it('should wrap values with spaces in double quotes', () => {
			const meta = {
				msg: 'Bad response'
			};
			formatFields(meta).should.equal('msg="Bad response"');
		});

		it('should convert values with double quotes to singles', () => {
			const meta = {
				msg: 'Server responded with "Bad Request", 400'
			};
			formatFields(meta).should.equal('msg="Server responded with \'Bad Request\', 400"');
		});

		it('should handle non-string values', () => {
			const meta = {
				msg: 'Bad response',
				status: 400
			};
			formatFields(meta).should.equal('msg="Bad response" status=400');
		});

		it('should convert arrays to multi-valued fields', () => {
			const meta = {
				msg: ['value-one', 'value-two']
			};
			formatFields(meta).should.equal('msg="value-one,value-two"');
		});

	});

	describe('Value', () => {

		it('should exist', () => {
			formatValue.should.exist;
		});

	});

});
