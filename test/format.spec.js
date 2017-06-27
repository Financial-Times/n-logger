const chai = require('chai');

const format = require('../src/format');

chai.should();

describe('Format', () => {

	describe('Message', () => {

		it('should exist', () => {
			format.message.should.exist;
		});

		it('should replace double-quotes with single-quotes', () => {
			const message = 'an "error" occurred';
			format.message(message).should.equal('an \'error\' occurred');
		});

		it('should convert new lines to tabs', () => {
			const message = 'an error\nover \nmultiple lines';
			format.message(message).should.equal('an error	over 	multiple lines');
		});

	});

	describe('Fields', () => {

		it('should exist', () => {
			format.fields.should.exist;
		});

		it('should format fields', () => {
			const meta = {
				app: 'ft-next-front-page'
			};
			format.fields(meta).should.equal('app=ft-next-front-page');
		});

		it('should format multiple fields', () => {
			const meta = {
				app: 'ft-next-front-page',
				level: 'error'
			};
			format.fields(meta).should.equal('app=ft-next-front-page level=error');
		});

		it('should handle non-string values', () => {
			const meta = {
				status: 400
			};
			format.fields(meta).should.equal('status=400');
		});

		it('should handle array values', () => {
			const meta = {
				msg: ['value one', 'value "two"', 'value \nthree']
			};
			format.fields(meta).should.equal('msg=value one,value "two",value \nthree');
		});

		context('if splunk Friendly', () => {

			it('should wrap values with spaces in double quotes', () => {
				const meta = {
					msg: 'Bad response'
				};
				format.fields(meta, { splunkFriendly: true }).should.equal('msg="Bad response"');
			});

			it('should wrap values with equals (`=`) in double quotes', () => {
				const meta = {
					msg: 'Bad=response'
				};
				format.fields(meta, { splunkFriendly: true }).should.equal('msg="Bad=response"');
			});

			it('should convert double quotes to singles', () => {
				const meta = {
					msg: 'Server responded with "Bad Request", 400'
				};
				format.fields(meta, { splunkFriendly: true }).should.equal('msg="Server responded with \'Bad Request\', 400"');
			});

			it('should convert new lines to tabs', () => {
				const meta = {
					msg: 'an error\nover \nmultiple lines'
				};
				format.fields(meta, { splunkFriendly: true }).should.equal('msg="an error	over 	multiple lines"');
			});

			it('should handle and sanitise array values', () => {
				const meta = {
					msg: ['value one', 'value "two"', 'value \nthree']
				};
				format.fields(meta, { splunkFriendly: true }).should.equal('msg="value one,value \'two\',value 	three"');
			});

		});

	});

});
