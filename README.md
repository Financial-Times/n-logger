# n-logger [![Circle CI](https://circleci.com/gh/Financial-Times/n-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-logger) ![GitHub release](https://img.shields.io/github/release/Financial-Times/n-logger.svg?style=popout)

This package provides a Winston wrapper which sends server-side logs to Splunk's HTTP Event Collector (HEC).

_Please note_ that this package is not only used by the Customer Products team. Please be mindful of this as any changes may impact other teams, such as Internal Products, differently.


## Getting started

This package is compatible with Node 8+ and is distributed on npm.

```bash
npm install --save @financial-times/n-logger
```

After installing the package you will need to configure your production application with the `SPLUNK_HEC_TOKEN` environment variable. If you are working on a `next-` application this will be specified in the shared secrets folder in Vault.


## Usage

```js
import logger from '@financial-times/n-logger';

logger.log('info', 'Saying hello');
logger.info('Saying hello');
logger.warn('Everything’s mostly cool');
logger.error('Uh-oh', { field: 'some value' });
logger.info({ event: 'UPDATE_NOTIFICATION', data: data });

const error = new Error('Whoops!');
logger.error('Uh-oh', error, { extra_field: 'boo' });
```

If using CommonJS modules:

```js
const logger = require('@financial-times/n-logger').default;
```


### Loggers

By default, the following loggers are configured:

  1. **The `console` logger**

      The default logger. The log levels to output to the terminal can be set using the `CONSOLE_LOG_LEVEL` environment variable (defaults to `silly`).

  2. **The `splunkHEC` logger**

      Used if the `SPLUNK_HEC_TOKEN` environment variable is present. The log levels to send to Splunk can be set using the `SPLUNK_LOG_LEVEL` environment variable (defaults to `warn`).


## Testing n-logger locally

If you are making a change to `n-logger` it is worth testing it locally to check it is sending logs successfully before merging.

1. Create a test.js file in the root of your local n-logger.
1. Add the following to this file:

  ```js
  const logger = require('./dist/main').default;

  logger.warn('Testing Testing Testing');
  logger.warn({ event: 'HELLO_WORLD', message: 'Testing 1 2 3', count: 5 }, {fizz: 'buzz'});
  ```

1. In the terminal `export NODE_ENV=production`, `export SYSTEM_CODE=next-foo-bar` and `export SPLUNK_HEC_TOKEN={token}` (find this token in the `next/shared` folder in Vault).

1. Run `node test` in the terminal.
1. If everything is working correctly, you should be able to see your test logs in Splunk with the query `index=heroku source="/var/log/apps/heroku/ft-next-foo-bar.log"`.


### API

#### log(level, message, ...meta)

 * `level` can be silly, debug, verbose, info, warn or error
 * `message` is optional
 * any number of meta objects can be supplied, including `Error` objects
 * **IMPORTANT NOTE** - do not send errors as properties of other objects, e.g. `{event: 'My_EVENT', error}`. This will result in no details of the error being logged**

#### silly|debug|verbose|info|warn|error(message, ...meta)

#### addConsole(level = 'info', opts = {})

#### removeConsole()

#### addSplunkHEC(level = 'info', opts = {})

#### removeSplunkHEC()

#### clearLoggers()

#### addContext(metadata = {})

Additional `metadata` properties to be appended to every subsequent log call.

#### logger

The [Winston object](https://github.com/winstonjs/winston)
