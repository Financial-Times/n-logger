import chai from 'chai';
chai.should();
import { formatObject, formatValue } from '../../src/lib/format-splunk';

describe('Format Splunk', () => {

	it('should exist', () => {
		formatObject.should.exist;
		formatValue.should.exist;
	});

	it('should format objects', () => {
		const meta = {
			app: 'ft-next-front-page'
		};
		formatObject(meta).should.equal('app=ft-next-front-page');
	});

	it('should format objects with multiple properties', () => {
		const meta = {
			app: 'ft-next-front-page',
			level: 'error'
		};
		formatObject(meta).should.equal('app=ft-next-front-page level=error');
	});

	it('should wrap values with spaces in double quotes', () => {
		const meta = {
			msg: 'Bad response'
		};
		formatObject(meta).should.equal('msg="Bad response"');
	});

	it('should convert values with double quotes to singles', () => {
		const meta = {
			msg: 'Server responded with "Bad Request", 400'
		};
		formatObject(meta).should.equal('msg="Server responded with \'Bad Request\', 400"');
	});

	it('should handle non-string values', () => {
		const meta = {
			msg: 'Bad response',
			status: 400
		};
		formatObject(meta).should.equal('msg="Bad response" status=400');
	});

});
