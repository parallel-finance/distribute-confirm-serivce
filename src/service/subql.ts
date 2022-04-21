import { gql, request } from 'graphql-request';
import { getAppLogger } from 'logger';

const log = getAppLogger('service-subql');

type SubqlMeta = {
  lastProcessedHeight;
  lastProcessedTimestamp;
};

export async function lastProcessedData(): Promise<SubqlMeta> {
  const { _metadata } = await request(
    process.env.ACALA_SUBQL_ENDPOINT,
    gql`
      query {
        _metadata {
          lastProcessedHeight
          lastProcessedTimestamp
        }
      }
    `
  );
  return _metadata;
}
