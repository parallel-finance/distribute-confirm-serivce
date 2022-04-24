import dotenv from 'dotenv';

dotenv.config();

const config = () => ({
  NODE_ENV: process.env.NODE_ENV || 'dev',
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite:///test.sqlite',
  EXPIRE_HOURS: process.env.EXPIRE_HOURS || 6,
  ACALA_SUBQL_ENDPOINT: process.env.ACALA_SUBQL_ENDPOINT || 'https://api.subquery.network/sq/parallel-finance/acala-distribution-subql__cGFyY',
  MOONBEAM_SUBQL_ENDPOINT: process.env.MOONBEAM_SUBQL_ENDPOINT || 'https://api.subquery.network/sq/parallel-finance/moonbeam-distribution-subql__cGFyY'
});

export default config;
