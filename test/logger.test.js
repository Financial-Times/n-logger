/* global describe, before, it */
'use strict';

require('chai').should();
const logger = require('../main');

describe('Logger', () => {

	afterEach(() => {
		logger.clearLoggers();
	});

	it('should exist', () => {
		logger.should.exist;
	});

	it('should be able to clear loggers', () => {
		logger.addConsole();
		logger.clearLoggers();
		logger.logger.transports.should.be.empty;
	});

	describe('Console', () => {

		it('should be able to add', () => {
			logger.addConsole('warn');
			logger.logger.transports.console.level.should.equal('warn');
		});

		it('should have "info" level by default', () => {
			logger.addConsole();
			logger.logger.transports.console.level.should.equal('info');
		});

		it('should not be able to add if already added', () => {
			logger.addConsole();
			(() => logger.addConsole()).should.not.throw(Error);
		});

		it('should be able to remove', () => {
			logger.addConsole();
			logger.removeConsole();
			logger.logger.transports.should.be.empty;
		});

		it('should not be able to remove if not added', () => {
			(() => logger.removeConsole()).should.not.throw(Error);
		});

	});

	describe('Splunk', () => {

		it('should be able to add', () => {
			logger.addSplunk('http://splunk.ft.com', 'ft-next-front-page', 'warn');
			logger.logger.transports.splunk.level.should.equal('warn');
		});

		it('should have "error" level by default', () => {
			logger.addSplunk('http://splunk.ft.com', 'ft-next-front-page');
			logger.logger.transports.splunk.level.should.equal('error');
		});

		it('should return false if no `host` supplied', () => {
			logger.addSplunk().should.equal(false);
		});

		it('should return false if no `appName` supplied', () => {
			logger.addSplunk('http://splunk.ft.com').should.equal(false);
		});

		it('should not be able to add if already added', () => {
			logger.addSplunk();
			(() => logger.addSplunk()).should.not.throw(Error);
		});

		it('should be able to remove', () => {
			logger.addSplunk();
			logger.removeSplunk();
			logger.logger.transports.should.be.empty;
		});

		it('should not be able to remove if not added', () => {
			(() => logger.removeSplunk()).should.not.throw(Error);
		});

	});

});
