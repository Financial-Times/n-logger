/* global describe, afterEach, it */
'use strict';

require('chai').should();
const logger = require('../main');

describe('Logger', () => {

	afterEach(() => {
		logger.reset();
	});

	it('should exist', () => {
		logger.should.exist;
	});

	it('should fail if init isn\'t called first', () => {
		(() => { logger.logger }).should.throw(/^Please call init first$/);
	});

	it('should have console and splunk transports', () => {
		logger.init('ft-next-front-page');
		const transports = logger.logger.transports;
		transports.console.should.exists;
		transports.splunk.should.exists;
	});

	it('should log to splunk on error', () => {
		logger.init('ft-next-front-page');
		logger.logger.transports.splunk.level.should.equal('error');
	});

});
