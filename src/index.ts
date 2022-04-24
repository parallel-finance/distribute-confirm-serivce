import { unexpectedListener } from './utils';
import { createDBConnection } from './entity';
import { getAppLogger } from './logger';
import { uncheckTxScheduler } from './postgres';

const log = getAppLogger('Index');

async function run() {
  log.info('Start to run distribute-confirmation-service');
  unexpectedListener();

  log.info('Start to connect to database');
  const connection = await createDBConnection();
  log.info(`DB connected!`);

  await uncheckTxScheduler(connection);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    log.debug(err.message);
    process.exit(1)
  });

  process.on('unhandledRejection', err => log.error(err))
