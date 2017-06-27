/* eslint no-console: 0 */

const sinon = require('sinon');
const chai = require('chai');
const chaiString = require('chai-string');
const sinonChai = require('sinon-chai');

const Function = require('../../src/loggers/function');

chai.should();
chai.use(chaiString);
chai.use(sinonChai);

describe('Logger - Function', () => {
	it('should exist', () => {
		Function.should.exist;
	});

	it('should be able to instantiate', () => {
		const logger = new Function();
		logger.should.not.be.undefined;
	});

	describe('#log', () => {
		beforeEach(() => {
			sinon.spy(console, 'log');
		});

		afterEach(() => {
			console.log.restore();
		});

		it('should be able to log a message', () => {
			const logger = new Function();
			logger.log('info', 'a message');
			console.log.should.always.have.been.calledWithExactly('a message level=info');
		});

		it('should be able to use shorthand methods', () => {
			const logger = new Function();
			logger.info('a message');
			console.log.should.always.have.been.calledWithExactly('a message level=info');
		});

		it('should pass message and meta through', () => {
			const logger = new Function();
			logger.log('info', 'a message', { foo: 'foo' });
			console.log.should.always.have.been.calledWithExactly('a message foo=foo level=info');
		});

		it('should pass meta only through', () => {
			const logger = new Function();
			logger.log('info', { foo: 'bar' });
			console.log.should.always.have.been.calledWithExactly('foo=bar level=info');
		});

		it('should convert Error message to meta', () => {
			class MyError extends Error { };
			const logger = new Function();
			logger.log('info', new MyError('whoops!'));
			console.log.should.always.have.been.calledWithMatch(/^error_message=whoops! error_name=Error error_stack=Error: whoops!/);
			console.log.should.always.have.been.calledWithMatch(/level=info$/);
		});

		it('should combine Error message meta', () => {
			class MyError extends Error { };
			const logger = new Function();
			logger.log('info', new MyError('whoops!'), { foo: 'bar' });
			console.log.should.always.have.been.calledWithMatch(/^foo=bar error_message=whoops! error_name=Error error_stack=Error: whoops!/);
			console.log.should.always.have.been.calledWithMatch(/level=info$/);
		});

		it('should handle message and Error meta', () => {
			class MyError extends Error { };
			const logger = new Function();
			logger.log('info', 'a message', new MyError('whoops!'));
			console.log.should.always.have.been.calledWithMatch(/^a message error_message=whoops! error_name=Error error_stack=Error: whoops!/);
			console.log.should.always.have.been.calledWithMatch(/level=info$/);
		});

		it('should be able to send message, error and meta', () => {
			class MyError extends Error { };
			const logger = new Function();
			logger.log('info', 'a message', new MyError('whoops!'), { extra: 'foo' });
			console.log.should.always.have.been.calledWithMatch(/^a message extra=foo error_message=whoops! error_name=Error error_stack=Error: whoops!/);
			console.log.should.always.have.been.calledWithMatch(/level=info$/);
		});

		it('should be able to send multiple metas, earlier arguments taking priority', () => {
			const logger = new Function();
			logger.log('info', { extra: 'foo' }, { anotherExtra: 'bar' }, { extra: 'baz' });
			console.log.should.always.have.been.calledWithExactly('extra=foo anotherExtra=bar level=info');
		});
	});
});
