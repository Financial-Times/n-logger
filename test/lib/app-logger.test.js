import sinon from 'sinon';
import chai from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';

import Logger from '../../dist/lib/app-logger';

chai.should();
chai.use(chaiString);
chai.use(sinonChai);

const winstonStub = ({
	log = () => {},
	add = () => {},
	remove = () => {},
	transports = {},
	Console = () => {}
}) => {
	return {
		Logger: function () {
			this.log = log;
			this.add = add;
			this.remove = remove;
			this.transports = transports;
		},
		transports: { Console }
	};
};

describe('Logger', () => {

	it('should exist', () => {
		Logger.should.exist;
	});

	it('should be able to instantiate', () => {
		const logger = new Logger();
		logger.should.not.equal(undefined);
	});

	describe('#log', () => {

		it('should be able to log a message', () => {
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.log('info', 'a message');
			logSpy.should.always.have.been.calledWithExactly('info', 'a message', {});
		});

		it('should be able to use shorthand methods', () => {
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.info('a message');
			logSpy.should.always.have.been.calledWithExactly('info', 'a message', {});
		});

		it('should pass message and meta through', () => {
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.log('info', 'a message', { foo: 'foo' });
			logSpy.should.always.have.been.calledWithExactly('info', 'a message', { foo: 'foo' });
		});

		it('should pass meta solely through', () => {
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.log('info', { foo: 'foo' });
			logSpy.should.always.have.been.calledWithExactly('info', { foo: 'foo' });
		});

		it('should convert Error message to meta', () => {
			class MyError extends Error { };
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.log('info', new MyError('whoops!'));
			logSpy.lastCall.args[1].should.have.property('error_message', 'whoops!');
			logSpy.lastCall.args[1].should.have.property('error_name', 'Error');
			logSpy.lastCall.args[1].error_stack.should.startWith('Error: whoops!');
		});

		it('should combine Error message meta', () => {
			class MyError extends Error { };
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.log('info', new MyError('whoops!'), { foo: 'foo' });
			logSpy.lastCall.args[1].should.have.property('error_message', 'whoops!');
			logSpy.lastCall.args[1].should.have.property('foo', 'foo');
		});

		it('should handle message and Error meta', () => {
			class MyError extends Error { };
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.log('info', 'a message', new MyError('whoops!'));
			logSpy.lastCall.args[1].should.equal('a message');
			logSpy.lastCall.args[2].should.have.property('error_message', 'whoops!');
		});

		it('should be able to send message, error and meta', () => {
			class MyError extends Error { };
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.log('info', 'a message', new MyError('whoops!'), { extra: 'foo' });
			logSpy.lastCall.args[1].should.equal('a message');
			logSpy.lastCall.args[2].should.have.property('error_message', 'whoops!');
			logSpy.lastCall.args[2].should.have.property('extra', 'foo');
		});

		it('should be able to send multiple metas, earlier arguments taking priority', () => {
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.log('info', { extra: 'foo' }, { anotherExtra: 'bar' }, { extra: 'baz' });
			logSpy.should.always.have.been.calledWithExactly('info', { extra: 'foo', anotherExtra: 'bar' });
		});

	});

	describe('#addConsole', () => {

		it('should be able to add a console logger', () => {
			const formatter = () => {};
			const addSpy = sinon.spy();
			const ConsoleSpy = sinon.spy();
			const winston = winstonStub({ add: addSpy, Console: ConsoleSpy });
			const logger = new Logger({ winston, formatter });
			logger.addConsole();
			addSpy.should.always.have.been.calledWithExactly(ConsoleSpy, { level: 'info', formatter, colorize: true });
		});

		it('should be able to set the console logger\'s level', () => {
			const addSpy = sinon.spy();
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston });
			logger.addConsole('warn');
			addSpy.lastCall.args[1].should.have.property('level', 'warn');
		});

		it('should be able to pass opts', () => {
			const addSpy = sinon.spy();
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston });
			logger.addConsole('info', { option: 'one' });
			addSpy.lastCall.args[1].should.have.property('option', 'one');
		});

		it('should not be able to add if already added', () => {
			const addSpy = sinon.spy(function () { this.transports.console = true; });
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston });
			logger.addConsole();
			logger.addConsole();
			addSpy.should.have.been.calledOnce;
		});

	});

	describe('#removeConsole', () => {

		it('should be able to remove', () => {
			const removeSpy = sinon.spy();
			const winston = winstonStub({ remove: removeSpy, transports: { console: true } });
			const logger = new Logger({ winston });
			logger.removeConsole();
			removeSpy.should.always.have.been.calledWithExactly('console');
		});

		it('should not be able to remove if not added', () => {
			const removeSpy = sinon.spy();
			const winston = winstonStub({ remove: removeSpy });
			const logger = new Logger({ winston });
			logger.removeConsole();
			removeSpy.should.not.have.been.called;
		});

	});

	describe('#addSplunk', () => {

		it('should be able to add a splunk logger', () => {
			const addSpy = sinon.spy();
			const SplunkSpy = sinon.spy();
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston, Splunk: SplunkSpy });
			logger.addSplunk('http://splunk.ft.com');
			addSpy.should.always.have.been.calledWithExactly(SplunkSpy, { level: 'info', splunkUrl: 'http://splunk.ft.com' });
		});

		it('should be able to set the console logger\'s level', () => {
			const addSpy = sinon.spy();
			const SplunkSpy = sinon.spy();
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston, Splunk: SplunkSpy });
			logger.addSplunk('http://splunk.ft.com', 'warn');
			addSpy.should.always.have.been.calledWithExactly(SplunkSpy, { level: 'warn', splunkUrl: 'http://splunk.ft.com' });
		});

		it('should return false if no `splunkUrl` supplied', () => {
			const addSpy = sinon.spy();
			const SplunkSpy = sinon.spy();
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston, Splunk: SplunkSpy });
			logger.addSplunk().should.be.false;
			addSpy.should.not.have.been.called;
		});

		it('should not be able to add if already added', () => {
			const addSpy = sinon.spy(function () { this.transports.splunk = true; });
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston });
			logger.addSplunk('http://splunk.ft.com');
			logger.addSplunk('http://splunk.ft.com');
			addSpy.should.have.been.calledOnce;
		});

	});

	describe('#removeSplunk', () => {

		it('should be able to remove', () => {
			const removeSpy = sinon.spy();
			const winston = winstonStub({ remove: removeSpy, transports: { splunk: true } });
			const logger = new Logger({ winston });
			logger.removeSplunk();
			removeSpy.should.always.have.been.calledWithExactly('splunk');
		});

		it('should not be able to remove if not added', () => {
			const removeSpy = sinon.spy();
			const winston = winstonStub({ remove: removeSpy });
			const logger = new Logger({ winston });
			logger.removeSplunk();
			removeSpy.should.not.have.been.called;
		});

	});

	describe('#addSplunkHEC', () => {

		it('should be able to add a splunkHEC logger', () => {
			const addSpy = sinon.spy();
			const SplunkHECSpy = sinon.spy();
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston, SplunkHEC: SplunkHECSpy });
			logger.addSplunkHEC();
			addSpy.should.always.have.been.calledWithExactly(SplunkHECSpy, { level: 'info' });
		});

		it('should be able to set the console logger\'s level', () => {
			const addSpy = sinon.spy();
			const SplunkHECSpy = sinon.spy();
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston, SplunkHEC: SplunkHECSpy });
			logger.addSplunkHEC('warn');
			addSpy.should.always.have.been.calledWithExactly(SplunkHECSpy, { level: 'warn' });
		});

		it('should not be able to add if already added', () => {
			const addSpy = sinon.spy(function () { this.transports.splunkHEC = true; });
			const winston = winstonStub({ add: addSpy });
			const logger = new Logger({ winston });
			logger.addSplunkHEC();
			logger.addSplunkHEC();
			addSpy.should.have.been.calledOnce;
		});

	});

	describe('#removeSplunkHEC', () => {

		it('should be able to remove', () => {
			const removeSpy = sinon.spy();
			const winston = winstonStub({ remove: removeSpy, transports: { splunkHEC: true } });
			const logger = new Logger({ winston });
			logger.removeSplunkHEC();
			removeSpy.should.always.have.been.calledWithExactly('splunkHEC');
		});

		it('should not be able to remove if not added', () => {
			const removeSpy = sinon.spy();
			const winston = winstonStub({ remove: removeSpy });
			const logger = new Logger({ winston });
			logger.removeSplunkHEC();
			removeSpy.should.not.have.been.called;
		});

	});

	describe('#clearLoggers', () => {

		it('should be able to clear loggers', () => {
			const removeSpy = sinon.spy();
			const winston = winstonStub({ remove: removeSpy, transports: { console: true, splunk: true } });
			const logger = new Logger({ winston });
			logger.clearLoggers();
			removeSpy.should.have.been.calledWith('console');
			removeSpy.should.have.been.calledWith('splunk');
		});

	});

	describe('#addContext', () => {

		it('should be able to add context to logs', () => {
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.addContext({ region: 'EU' });
			logger.log('info', 'a message');
			logSpy.should.always.have.been.calledWithExactly('info', 'a message', { region: 'EU' });
		});

		it('should be able to add multiple context to logs', () => {
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.addContext({ region: 'EU' });
			logger.addContext({ app: 'article' });
			logger.log('info');
			logSpy.should.always.have.been.calledWithExactly('info', { region: 'EU', app: 'article' });
		});

		it('should give priority to supplied meta', () => {
			const logSpy = sinon.spy();
			const winston = winstonStub({ log: logSpy });
			const logger = new Logger({ winston });
			logger.addContext({ region: 'EU' });
			logger.log('info', { region: 'US' });
			logSpy.should.always.have.been.calledWithExactly('info', { region: 'US' });
		});

	});

});
