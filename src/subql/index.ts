import { gql, request } from 'graphql-request';
import config from '../config';

export * from './acala';
export * from './moonbeam';

const { ACALA_SUBQL_ENDPOINT } = config();

type Metadata = {
  lastProcessedHeight;
  lastProcessedTimestamp;
};

export async function lastProcessedData(): Promise<Metadata> {
  const { _metadata } = await request(
    ACALA_SUBQL_ENDPOINT,
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


