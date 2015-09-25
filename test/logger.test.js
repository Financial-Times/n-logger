/* global describe, before, it */
'use strict';

require('chai').should();
const logger = require('../main');

describe('Logger', () => {

	before(() => {
		logger.init('ft-next-front-page');
	});

	it('should exist', () => {
		logger.should.exist;
	});

	it('should handle init-ing twice', () => {
		logger.init('ft-next-front-page');
	});

	it('should have console and splunk transports', () => {
		const transports = logger.logger.transports;
		transports.console.should.exists;
		transports.splunk.should.exists;
	});

	it('should log to splunk on error', () => {
		logger.logger.transports.splunk.level.should.equal('error');
	});

});
