# Next Logger [![Circle CI](https://circleci.com/gh/Financial-Times/n-logger.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-logger) ![GitHub release](https://img.shields.io/github/release/Financial-Times/n-logger.svg?style=popout)

N-logger is a Winston wrapper which sends logs to Splunk's Http Event Collector (HEC).

N-logger is not only used by Next. Please be mindful of this as any changes may impact other teams, such as Internal Products, differently.

## Installation
```
npm install @financial-times/n-logger
```

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


  * The `splunkHEC` logger, if `SPLUNK_HEC_TOKEN` is present
    * logger level can be set by `SPLUNK_LOG_LEVEL` env var (defaults to `warn`).

If you wish to see logs in Splunk that are at levels lower than warn, you can change the default level by setting a `SPLUNK_LOG_LEVEL` environment variable.

## Testing n-logger locally

If you are making a change to n-logger it is worth testing it locally to check it is sending logs successfully before merging.
1. Create a test.js file in the root of your local n-logger.
1. Add the following to this file:

  ```
  const logger = require('./dist/main').default;

  logger.warn('Testing Testing Testing');
  logger.warn({ event: 'HELLO_WORLD', message: 'Testing 1 2 3', count: 5 }, {fizz: 'buzz'});
  ```

1. In the terminal `export NODE_ENV=production`, `export SYSTEM_CODE=next-foo-bar` and `export SPLUNK_HEC_TOKEN={token}` (find this token in the next/shared folder in Vault).

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

#### addContext(meta)
`meta` to be sent with every subsequent log call

#### logger

The [Winston object](https://github.com/winstonjs/winston)
