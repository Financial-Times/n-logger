# Next Logger [![Circle CI](https://circleci.com/gh/Financial-Times/next-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/next-logger)

Logging utility

## Usage

```
var logger = require('ft-next-logger').logger;
logger.info('Saying hello');
logger.warn('Everything’s mostly cool');
logger.error('Uh-oh', { field: 'some value' });
```

(Uses Winston, so see [here](https://github.com/winstonjs/winston) for full api)

### Loggers

By default 

 * the `console` logger is added if `NODE_ENV !== production`
 * the `splunk` logger is added if `NODE_ENV === production` and there is a `SPLUNK_URL` env variable

### API

 * `addConsole(level = 'info', opts = {})`
 * `removeConsole()`
 * `addSplunk(splunkUrl, level = 'error', opts = {})`
 * `removeSplunk()`
 * `clearLoggers()`

## Releasing

    $ make release version=patch

Version also accepts `minor` and `major`

