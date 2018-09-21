# Next Logger [![Circle CI](https://circleci.com/gh/Financial-Times/n-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-logger)

N-logger is a Winston wrapper which sends logs to Splunk's Http Event Collector (HEC).

## Installation

    npm install @financial-times/n-logger

    Ensure `SPLUNK_HEC_TOKEN` is in the app's shared folder in Vault.

## Usage

    import logger from '@financial-times/n-logger';

    logger.log('info', 'Saying hello');
    logger.info('Saying hello');
    logger.warn('Everything’s mostly cool');
    logger.error('Uh-oh', { field: 'some value' });
    logger.info({ event: 'UPDATE_NOTIFICATION', data: data });

    const err = new Error('Whoops!');
    logger.error('Uh-oh', err, { extra_field: 'boo' });

If using CommonJS modules

    const logger = require('@financial-times/n-logger').default;

### Loggers

By default, the following loggers are added:

  * The `console` logger
    * logger level can be set by `CONSOLE_LOG_LEVEL` env var (defaults to `silly`).


  * The `splunkHEC` logger, if `NODE_ENV === production && SPLUNK_HEC_TOKEN`
    * logger level can be set by `SPLUNK_LOG_LEVEL` env var (defaults to `warn`).

### API

#### log(level, message, ...meta)

 * `level` can be silly, debug, verbose, info, warn or error
 * `message` is optional
 * any number of meta objects can be supplied, including `Error` objects

#### silly|debug|verbose|info|warn|error(message, ...meta)

#### addConsole(level = 'info', opts = {})

#### removeConsole()

#### addSplunkHEC(level = 'info', opts = {})

#### removeSplunkHEC()

#### clearLoggers()

#### addContext(meta)
`meta` to be sent with every subsequent log call

#### logger

The [Winston object](https://github.com/winstonjs/winston)
