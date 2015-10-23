# Next Logger [![Circle CI](https://circleci.com/gh/Financial-Times/next-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/next-logger)

Logging utility

## Usage

```
var logger = require('ft-next-logger').logger;
logger.info('Saying hello');
logger.warn('Everything’s mostly cool');
logger.error('Uh-oh', { field: 'some value' });
```

### Loggers

By default

 * the `console` logger is added; logs to `error` if `NODE_ENV === test`, `info` otherwise
 * the `splunk` logger is added if `NODE_ENV === production`

### API

 * `logger` - the [Winston object](https://github.com/winstonjs/winston)
 * `addConsole(level = 'info', opts = {})`
 * `removeConsole()`
 * `addSplunk(splunkUrl, level = 'info', opts = {})`
 * `removeSplunk()`
 * `clearLoggers()`

## Releasing

    $ make release version=patch

Version also accepts `minor` and `major`

