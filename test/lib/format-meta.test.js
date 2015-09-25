/* global describe, it */
'use strict';

require('chai').should();
const formatMeta = require('../../lib/format-meta');

describe('Format Meta', () => {

	it('should exist', () => {
		formatMeta.should.exist;
	});

	it('should format objects', () => {
		const meta = {
			app: 'ft-next-front-page'
		};
		formatMeta(meta).should.equal('app=ft-next-front-page');
	});

	it('should format objects with multiple properties', () => {
		const meta = {
			app: 'ft-next-front-page',
			level: 'error'
		};
		formatMeta(meta).should.equal('app=ft-next-front-page level=error');
	});

	it('should wrap values with spaces in double quotes', () => {
		const meta = {
			msg: 'Bad response'
		};
		formatMeta(meta).should.equal('msg="Bad response"');
	});

	it('should convert values with double quotes to singles', () => {
		const meta = {
			msg: 'Server responded with "Bad Request", 400'
		};
		formatMeta(meta).should.equal('msg="Server responded with \'Bad Request\', 400"');
	});

	it('should handle non-string values', () => {
		const meta = {
			msg: 'Bad response',
			status: 400
		};
		formatMeta(meta).should.equal('msg="Bad response" status=400');
	});

});
