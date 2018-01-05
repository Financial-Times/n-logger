/* eslint no-console: 0 */

import sinon from 'sinon';
import chai from 'chai';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';

import levels from '../../dist/lib/levels';
import Logger from '../../dist/lib/function-logger';

chai.should();
chai.use(chaiString);
chai.use(sinonChai);

describe('Logger', () => {

	it('should exist', () => {
		Logger.should.exist;
	});

	it('should be able to instantiate', () => {
		const logger = new Logger();
		logger.should.not.equal(undefined);
	});

	describe('#log', () => {

		beforeEach(() => {
			sinon.spy(console, 'log');
		});

		afterEach(() => {
			console.log.restore();
		});

		it('should be able to log a message', () => {
			const logger = new Logger();
			logger.log('info', 'a message');
			console.log.should.always.have.been.calledWithExactly('a message level=info');
		});

		levels.forEach((level) => {

			const testLevels = levels.indexOf(level) > 0 ? levels.slice(0, levels.indexOf(level) - 1) : []
			testLevels.forEach((testLevel) => {
				it(`should not allow logging at ${testLevel} if the level is ${level}`, () => {
					const logger = new Logger({level});
					logger.log(testLevel, 'a message', { foo: 'foo' });
					console.log.should.not.have.been.called;
				});
			})

			levels.slice(levels.indexOf(level)).forEach((testLevel) => {
				it(`should allow logging at ${testLevel} if the level is ${level}`, () => {
					const logger = new Logger({level});
					logger.log(testLevel, 'a message');
					console.log.should.always.have.been.calledWithExactly(`a message level=${testLevel}`);
				})
			});
		})

		it('should be able to use shorthand methods', () => {
			const logger = new Logger();
			logger.info('a message');
			console.log.should.always.have.been.calledWithExactly('a message level=info');
		});

		it('should pass message and meta through', () => {
			const logger = new Logger();
			logger.log('info', 'a message', { foo: 'foo' });
			console.log.should.always.have.been.calledWithExactly('a message foo=foo level=info');
		});

		it('should pass meta solely through', () => {
			const logger = new Logger();
			logger.log('info', { foo: 'bar' });
			console.log.should.always.have.been.calledWithExactly('foo=bar level=info');
		});

		it('should convert Error message to meta', () => {
			class MyError extends Error { };
			const logger = new Logger();
			logger.log('info', new MyError('whoops!'));
			console.log.should.always.have.been.calledWithMatch(/^error_message=whoops! error_name=Error error_stack="Error: whoops!/);
			console.log.should.always.have.been.calledWithMatch(/level=info$/);
		});

		it('should combine Error message meta', () => {
			class MyError extends Error { };
			const logger = new Logger();
			logger.log('info', new MyError('whoops!'), { foo: 'bar' });
			console.log.should.always.have.been.calledWithMatch(/^foo=bar error_message=whoops! error_name=Error error_stack="Error: whoops!/);
			console.log.should.always.have.been.calledWithMatch(/level=info$/);
		});

		it('should handle message and Error meta', () => {
			class MyError extends Error { };
			const logger = new Logger();
			logger.log('info', 'a message', new MyError('whoops!'));
			console.log.should.always.have.been.calledWithMatch(/^a message error_message=whoops! error_name=Error error_stack="Error: whoops!/);
			console.log.should.always.have.been.calledWithMatch(/level=info$/);
		});

		it('should be able to send message, error and meta', () => {
			class MyError extends Error { };
			const logger = new Logger();
			logger.log('info', 'a message', new MyError('whoops!'), { extra: 'foo' });
			console.log.should.always.have.been.calledWithMatch(/^a message extra=foo error_message=whoops! error_name=Error error_stack="Error: whoops!/);
			console.log.should.always.have.been.calledWithMatch(/level=info$/);
		});

		it('should be able to send multiple metas, earlier arguments taking priority', () => {
			const logger = new Logger();
			logger.log('info', { extra: 'foo' }, { anotherExtra: 'bar' }, { extra: 'baz' });
			console.log.should.always.have.been.calledWithExactly('extra=foo anotherExtra=bar level=info');
		});

	});

	describe('#addContext', () => {

		beforeEach(() => {
			sinon.spy(console, 'log');
		});

		afterEach(() => {
			console.log.restore();
		});

		it('should be able to add context to logs', () => {
			const logger = new Logger();
			logger.addContext({ region: 'EU' });
			logger.log('info', 'a message');
			console.log.should.always.have.been.calledWithExactly('a message region=EU level=info');
		});

		it('should be able to add multiple context to logs', () => {
			const logger = new Logger();
			logger.addContext({ region: 'EU' });
			logger.addContext({ app: 'article' });
			logger.log('info');
			console.log.should.always.have.been.calledWithExactly('region=EU app=article level=info');
		});

		it('should give priority to supplied meta', () => {
			const logger = new Logger();
			logger.addContext({ region: 'EU' });
			logger.log('info', { region: 'US' });
			console.log.should.always.have.been.calledWithExactly('region=US level=info');
		});

	});

});
