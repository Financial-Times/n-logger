# Next Logger [![Circle CI](https://circleci.com/gh/Financial-Times/n-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-logger)

Logging utility

## Installation

    npm install @financial-times/n-logger


## Usage

    import logger from '@financial-times/n-logger';

    logger.log('info', 'Saying hello');
    logger.info('Saying hello');
    logger.warn('Everything’s mostly cool');
    logger.error('Uh-oh', { field: 'some value' });

    const err = new Error('Whoops!');
    logger.error('Uh-oh', err, { extra_field: 'boo' });

If using CommonJS modules

    const logger = require('@financial-times/n-logger').default;

### Loggers

By default

  * the `console` logger is added
    * logger level can be set by `CONSOLE_LOG_LEVEL` env variable; defaults to `silly`
  * the `splunk` logger is added if `NODE_ENV === production`
    * logger level can be set by `SPLUNK_LOG_LEVEL` env variable; defaults to `warn`

### API

#### log(level, message, ...meta)

 * `level` can be silly, debug, verbose, info, warn or error
 * `message` is optional
 * any number of meta objects can be supplied, including `Error` objects

#### silly|debug|verbose|info|warn|error(message, ...meta)

#### addConsole(level = 'info', opts = {})

#### removeConsole()

#### addSplunk(splunkUrl, level = 'info', opts = {})

#### removeSplunk()

#### clearLoggers()

#### addContext(meta)
`meta` to be sent with every subsequent log call

#### logger

The [Winston object](https://github.com/winstonjs/winston)
