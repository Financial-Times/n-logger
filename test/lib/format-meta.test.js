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
		formatMeta(meta).should.equal('app="ft-next-front-page"');
	});

	it('should format objects with multiple properties', () => {
		const meta = {
			app: 'ft-next-front-page',
			level: 'error'
		};
		formatMeta(meta).should.equal('app="ft-next-front-page" level="error"');
	});

	it('should convert values with double quotes to singles', () => {
		const meta = {
			msg: 'server responed with "Bad Request", 400'
		};
		formatMeta(meta).should.equal('msg="server responed with \'Bad Request\', 400"');
	});

});
