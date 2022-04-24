import { unexpectedListener } from './utils';
import { getDataSource } from './entity';
import { getAppLogger } from './logger';
import { uncheckTxScheduler } from './postgres';

const log = getAppLogger('Entry: index');

async function run() {
  unexpectedListener();

  const connection = await getDataSource();

  log.info(`DB connected!`);
  await uncheckTxScheduler(connection);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.debug(err);
    process.exit(1)
  });

  process.on('unhandledRejection', err => logger.error(err))
