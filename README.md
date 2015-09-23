# Next Logger

Logging utility

## Usage

```
import {init as loggerInit, logger} from 'ft-next-logger';
# init first, setting the app's name
loggerInit({ appName: 'ft-next-front-page' });

logger.info('Saying hello');
logger.warn('Everything’s mostly cool');
logger.error('Uh-oh', { field: 'some value' });
```

(Uses Winston, so see [here](https://github.com/winstonjs/winston) for full api)
