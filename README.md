# Next Logger [![Circle CI](https://circleci.com/gh/Financial-Times/next-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/next-logger)

Logging utility

## Usage

```
import logger from 'ft-next-logger';
logger.info('Saying hello');
logger.warn('Everything’s mostly cool');
logger.error('Uh-oh', { field: 'some value' });
```

If using CommonJS modules

```
const logger = require('ft-next-logger').default;
```

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

