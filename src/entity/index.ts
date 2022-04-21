import { DataSource } from 'typeorm';
import { ClaimedReward } from './claimed-reward';
import { RewardDistributionTask } from './reward-distribution-task';
import { UserProjectRewardInfo } from './user-project-reward-info';
import { LedgerRewardAddress } from './ledger-reward-address';
import { MoonbeamRewardAddress } from './moonbeam_reward_address';

export * from './claimed-reward';
export * from './reward-distribution-task';
export * from './user-project-reward-info';
export * from './ledger-reward-address';
export * from './moonbeam_reward_address';

const sqliteDataSource = () =>
new DataSource({
  type: 'sqlite',
  database: 'test.sqlite',
  entities: [DotWithdrawTask],
  synchronize: true,
});

const dataSource = () =>
new DataSource({
  type: 'postgres',
  url: process.env.DB_CONNECTION_STRING,
  entities: [DotWithdrawTask],
});

let instance: DataSource;
export const getDataSource = () => {
  if (!instance) {
    instance =
      config().NODE_ENV === 'production' ? dataSource() : sqliteDataSource();
  }
  return instance;
};
