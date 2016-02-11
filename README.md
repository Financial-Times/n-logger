# Next Logger [![Circle CI](https://circleci.com/gh/Financial-Times/next-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/next-logger)

Logging utility

## Installation

    npm install @financial-times/n-logger


## Usage

    import logger from '@financial-times/n-logger';
    logger.info('Saying hello');
    logger.warn('Everything’s mostly cool');
    logger.error('Uh-oh', { field: 'some value' });

If using CommonJS modules

    const logger = require('@financial-times/n-logger').default;

### Loggers

By default

* the `console` logger is added
  * logger level can be set by `CONSOLE_LOG_LEVEL` environment variable; defaults to `silly`
* the `splunk` logger is added if `NODE_ENV === production`

### API

 * `logger` - the [Winston object](https://github.com/winstonjs/winston)
 * `addConsole(level = 'info', opts = {})`
 * `removeConsole()`
 * `addSplunk(splunkUrl, level = 'info', opts = {})`
 * `removeSplunk()`
 * `clearLoggers()`

