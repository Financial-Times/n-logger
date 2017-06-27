const chai = require('chai');
const chaiString = require('chai-string');

const Logger = require('../../src/loggers/logger');

const should = chai.should();
chai.use(chaiString);

describe('Logger', () => {
	it('should exist', () => {
		Logger.should.exist;
	});

	it('should be able to instantiate', () => {
		const logger = new Logger();
		logger.should.not.be.undefined;
	});

	it('should add logging shorthand methods', () => {
		const logger = new Logger();
		['silly', 'debug', 'verbose', 'info', 'warn', 'error'].forEach(level => {
			logger[level].should.not.be.undefined;
		});
	});

	describe('#tidyArgs', () => {
		it('should extract level, message and meta', () => {
			const logger = new Logger();
			const { level, message, meta } = logger.tidyArgs('info', 'Hunky dory', { region: 'EU' }, { app: 'next-front-page' });

			level.should.equal('info');
			message.should.equal('Hunky dory');
			meta.should.eql({ region: 'EU', app: 'next-front-page' });
		});

		it('should handle no message', () => {
			const logger = new Logger();
			const { level, message, meta } = logger.tidyArgs('info', { region: 'EU' }, { app: 'next-front-page' });

			level.should.equal('info');
			should.not.exist(message);
			meta.should.eql({ region: 'EU', app: 'next-front-page' });
		});

		it('should handle Error meta objects', () => {
			const error = new Error('Uh-oh!!!');
			const logger = new Logger();
			const { meta: { error_message, error_name, error_stack, region }} = logger.tidyArgs('info', { region: 'EU' }, error);

			error_message.should.equal('Uh-oh!!!');
			error_name.should.equal('Error');
			error_stack.should.include('Error: Uh-oh!!!\n');
			region.should.equal('EU');
		});

		it('should give preference to ‘leftmost’ meta argument', () => {
			const logger = new Logger();
			const { meta: { region }} = logger.tidyArgs('info', { region: 'EU' }, { region: 'US' });

			region.should.equal('EU');
		});
	});

	describe('#addContext', () => {
		it('should be able to add context to logs', () => {
			const logger = new Logger();
			logger.addContext({ region: 'EU' });

			logger.context.should.eql({ region: 'EU' });
		});

		it('should be able to add multiple contexts to logs', () => {
			const logger = new Logger();
			logger.addContext({ region: 'EU' });
			logger.addContext({ app: 'next-front-page' });

			logger.context.should.eql({ region: 'EU', app: 'next-front-page' });
		});
	});
});
