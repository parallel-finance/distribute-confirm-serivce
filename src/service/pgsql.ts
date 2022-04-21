/// schedule job for committed distribution txes in postgres.
import Mom from "moment";

import { diffTime, sleep } from "../utils";
import { lastProcessedData } from "./subql";
import { acalaHashExist, moonbeamHashExist } from "../subql";
import { getAppLogger, logger } from "logger";
import { RewardDistributionTask } from "common-service";
import { Connection, In } from "typeorm";

const log = getAppLogger("service-pgsql");

const HOUR = 1000 * 60 * 60;
const EXPIRE_HOURS = Number(process.env.EXPIRE_HOURS);
const ACALA_CROWDLOAN_ID = "2000-6-13";
const MOONBEAM_CROWDLOAN_ID = "2004-6-13";

async function isExpired(updateAt: Date): Promise<boolean> {
  const { lastProcessedTimestamp } = await lastProcessedData();

  const lastTime = Mom.unix(lastProcessedTimestamp / 1000);
  const diff = diffTime(Mom(updateAt), lastTime, "hours");
  return diff > EXPIRE_HOURS;
}

type Stat = "Pending" | "Verified" | "Committed" | "Succeed" | "Failed";

async function findUncheck(
  limit: number = 100
): Promise<RewardDistributionTask[]> {
  return await RewardDistributionTask.find({
    where: {
      status: "Committed",
    },
    take: limit,
    order: {
      updateAt: "ASC",
    },
  });
}

async function handleTxStatus(
  tx: RewardDistributionTask,
  successPool: string[],
  expirePool: string[],
  isExist: (hash: string) => Promise<boolean>
) {
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

export async function uncheckTxScheduler(conn: Connection) {
  log.info(`uncheck distribution scheduler start!`);
  while (true) {
    let successPool: string[] = [];
    let expirePool: string[] = [];
    const txes = await findUncheck(100);
    if (txes.length === 0) {
      await sleep(HOUR);
      continue;
    }
    for (const tx of txes) {
      log.debug(`handle tx crowdloan[${tx.crowdloanId}] hash[$${tx.txHash}]`)
      if (tx.crowdloanId === ACALA_CROWDLOAN_ID) {
        await handleTxStatus(tx, successPool, expirePool, acalaHashExist);
      } else if (tx.crowdloanId === MOONBEAM_CROWDLOAN_ID) {
        await handleTxStatus(tx, successPool, expirePool, moonbeamHashExist);
      } else {
        logger.error(`[SBH] invalid crowdloan id find: ${tx.crowdloanId}`);
      }
    }

    let re = await conn
      .createQueryBuilder()
      .update(RewardDistributionTask)
      .set({ status: "Succeed" })
      .where({ txHash: In(successPool) })
      .execute();
    if (re.affected < successPool.length) {
      logger.error(
        `update success txes error: not all txex have been updated [${re.affected}/${successPool.length}]: %o`,
        re
      );
    } else {
      log.info(`update txes status to 'Successed' done, total ${successPool.length}`)
    }

    re = await conn
      .createQueryBuilder()
      .update(RewardDistributionTask)
      .set({ status: "Failed" })
      .where({ txHash: In(expirePool) })
      .execute();
    if (re.affected !== expirePool.length) {
      logger.error(
        `update expire txes error: not all txex have been updated [${re.affected}/${expirePool.length}]: %o`,
        re
      );
    } else {
      log.info(`update expire trasactions done, total ${expirePool.length}`)
    }
    await sleep(500);
  }
}

