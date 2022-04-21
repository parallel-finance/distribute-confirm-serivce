subql
utils
index.tsimport { uncheckTxScheduler } from "./pgsql";
import { createDatabaseConnection } from "common-service";
import { getAppLogger } from "logger";

const log = getAppLogger("service");

export default class Service {
  static async run() {
    const conn = await createDatabaseConnection(process.env.DATABASE_URL);

    log.info(`db connected!`);
    await uncheckTxScheduler(conn);
  }
}
