import { Connection, createConnection } from 'typeorm';
import config from '../config';

import { RewardDistributionTask } from './reward-distribution-task';

export * from './reward-distribution-task';

const { DATABASE_URL, NODE_ENV } = config();

 export const createTestConnection = async (drop = true, database = ':memory:'): Promise<Connection> => {
  return await createConnection({
    type: 'sqlite',
    database,
    synchronize: true,
    dropSchema: drop,
    entities: [
      RewardDistributionTask
    ],
  });
};

const createPostgresConnection = async (): Promise<Connection> => {
  return await createConnection({
    type: 'postgres',
    url: DATABASE_URL,
    entities: [
      RewardDistributionTask
    ],
  });
};

export const createDBConnection = async () => {
  return NODE_ENV === 'dev' ? createTestConnection() : createPostgresConnection()
};
