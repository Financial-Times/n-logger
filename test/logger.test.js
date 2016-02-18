import sinon from 'sinon';
import chai from 'chai';
import chaiString from 'chai-string';
chai.should();
chai.use(chaiString);
import logger from '../src/main';

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

	describe('Logging', () => {

		let logSpy;

		beforeEach(() => {
			logSpy = sinon.spy(logger.logger, 'log');
		});

		afterEach(() => {
			logSpy.restore();
		});

		it('should call logger\'s log method', () => {
			logger.log('info', 'a message', { foo: 'foo' });
			logSpy.calledWithExactly('info', 'a message', { foo: 'foo' }).should.be.true;
		});

		it('should call logger\'s log method with shorthand', () => {
			logger.info('a message', { foo: 'foo' });
			logSpy.calledWithExactly('info', 'a message', { foo: 'foo' }).should.be.true;
		});

		it('should convert Error message to string', () => {
			class MyError extends Error { };
			logger.log('info', new MyError('whoops!'));
			logSpy.lastCall.args[1].should.startWith(
				'error_message=whoops! error_name=Error error_stack="Error: whoops!\n    at'
			);
		});

		it('should leave object message as is', () => {
			logger.info({ foo: 'foo' });
			logSpy.calledWithExactly('info', { foo: 'foo' }).should.be.true;
		});

	})

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
			logger.addSplunk('http://splunk.ft.com', 'warn');
			logger.logger.transports.splunk.level.should.equal('warn');
		});

		it('should have "info" level by default', () => {
			logger.addSplunk('http://splunk.ft.com');
			logger.logger.transports.splunk.level.should.equal('info');
		});

		it('should return false if no `splunkUrl` supplied', () => {
			logger.addSplunk().should.equal(false);
		});

		it('should not be able to add if already added', () => {
			logger.addSplunk('http://splunk.ft.com');
			(() => logger.addSplunk('http://splunk.ft.com')).should.not.throw(Error);
		});

		it('should be able to remove', () => {
			logger.addSplunk('http://splunk.ft.com');
			logger.removeSplunk();
			logger.logger.transports.should.be.empty;
		});

		it('should not be able to remove if not added', () => {
			(() => logger.removeSplunk()).should.not.throw(Error);
		});

	});

});
