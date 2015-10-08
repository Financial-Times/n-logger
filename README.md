# Next Logger [![Circle CI](https://circleci.com/gh/Financial-Times/next-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/next-logger)

Logging utility

## Usage

```
# add a logger
require('ft-next-logger').addConsole();

# then..
var logger = require('ft-next-logger').logger;
logger.info('Saying hello');
logger.warn('Everything’s mostly cool');
logger.error('Uh-oh', { field: 'some value' });
```

(Uses Winston, so see [here](https://github.com/winstonjs/winston) for full api)

### Loggers

#### Console

`addConsole(level = 'info', opts = {})`

#### Splunk

`addSplunk(appName, splunkUrl, level = 'error', opts = {})`

## Releasing

    $ make release version=patch

Version also accepts `minor`, `major`, etc. See the [release-it docs](https://www.npmjs.com/package/release-it#user-content-examples)

