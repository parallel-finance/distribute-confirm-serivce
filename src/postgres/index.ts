import Moment from 'Moment';
import { Connection, In } from 'typeorm';
import config from '../config';
import { diffTime, sleep } from '../utils';
import { lastProcessedData, acalaHashExist, moonbeamHashExist } from '../subql';
import { getAppLogger, logger } from '../logger';
import { RewardDistributionTask, RewardDistributionTaskStatus } from '../entity';

const log = getAppLogger('Postgres');

const HOUR = 1000 * 60 * 60;
const { EXPIRE_HOURS } = config();
const ACALA_CROWDLOAN_ID = '2000-6-13';
const MOONBEAM_CROWDLOAN_ID = '2004-6-13';

const isExpired = async (updateAt: Date): Promise<boolean> => {
  const { lastProcessedTimestamp } = await lastProcessedData();

  const lastTime = Moment.unix(lastProcessedTimestamp / 1000);
  const diff = diffTime(Moment(updateAt), lastTime, 'hours');
  return diff > EXPIRE_HOURS;
}

const findUncheck = async (limit = 100): Promise<RewardDistributionTask[]> => {
  return await RewardDistributionTask.find({
    where: {
      status: RewardDistributionTaskStatus.Committed,
    },
    take: limit,
    order: {
      updateAt: 'ASC',
    },
  });
}

const handleTxStatus = async (
  tx: RewardDistributionTask,
  successPool: string[],
  expirePool: string[],
  isExist: (hash: string) => Promise<boolean>
) => {
  const existed = await isExist(tx.txHash);
  if (existed) {
    successPool.push(tx.txHash);
  } else {
    const expired = await isExpired(tx.updateAt);
    if (expired) {
      expirePool.push(tx.txHash);
    }
  }
}

export const uncheckTxScheduler = async (connection: Connection) => {
  log.info(`Uncheck distribution scheduler start!`);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const successPool: string[] = [];
    const expirePool: string[] = [];
    const txes = await findUncheck(100);
    if (txes.length === 0) {
      await sleep(HOUR);
      continue;
    }
    for (const tx of txes) {
      log.debug(`Handle tx crowdloan[${tx.crowdloanId}] hash[$${tx.txHash}]`)
      if (tx.crowdloanId === ACALA_CROWDLOAN_ID) {
        await handleTxStatus(tx, successPool, expirePool, acalaHashExist);
      } else if (tx.crowdloanId === MOONBEAM_CROWDLOAN_ID) {
        await handleTxStatus(tx, successPool, expirePool, moonbeamHashExist);
      } else {
        logger.error(`[SBH] Invalid crowdloan id found: ${tx.crowdloanId}`);
      }
    }

    const succeedTasks = await connection
      .createQueryBuilder()
      .update(RewardDistributionTask)
      .set({ status: RewardDistributionTaskStatus.Succeed })
      .where({ txHash: In(successPool) })
      .execute();
    if (succeedTasks.affected < successPool.length) {
      logger.error(
        `Update txes to 'Succeed' status error: not all txes have been updated [${succeedTasks.affected}/${successPool.length}]: %o`,
        succeedTasks
      );
    } else {
      log.info(`Update txes status to 'Succeed' done, total ${successPool.length}`)
    }

    const failedTasks = await connection
      .createQueryBuilder()
      .update(RewardDistributionTask)
      .set({ status: RewardDistributionTaskStatus.Failed })
      .where({ txHash: In(expirePool) })
      .execute();
    if (failedTasks.affected !== expirePool.length) {
      logger.error(
        `Update txes to 'Failed' status error: not all txes have been updated [${failedTasks.affected}/${expirePool.length}]: %o`,
        failedTasks
      );
    } else {
      log.info(`Update txes status to 'Failed' done, total ${expirePool.length}`)
    }
    await sleep(500);
  }
}

