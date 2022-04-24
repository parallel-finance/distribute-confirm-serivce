import { DataSource } from 'typeorm';
import config from '../config';

import { RewardDistributionTask } from './reward-distribution-task';

export * from './reward-distribution-task';

const { DATABASE_URL, NODE_ENV } = config();

const sqliteDataSource = () =>
  new DataSource({
    type: 'sqlite',
    database: 'test.sqlite',
    entities: [RewardDistributionTask],
    synchronize: true,
  });

const dataSource = () =>
  new DataSource({
    type: 'postgres',
    url: DATABASE_URL,
    entities: [RewardDistributionTask]
  });

let instance: DataSource;
export const getDataSource = () => {
  if (!instance) {
    instance = NODE_ENV === 'test' ? sqliteDataSource() : dataSource();
  }
  return instance;
};
