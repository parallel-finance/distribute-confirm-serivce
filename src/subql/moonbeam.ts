import { gql, request } from 'graphql-request';
import config from '../config';

const { MOONBEAM_SUBQL_ENDPOINT } = config();

export async function moonbeamHashExist(hash: string): Promise<boolean> {
    const { distributedTransactions: { nodes } } = await request(
      MOONBEAM_SUBQL_ENDPOINT,
      gql`
      query {
          distributedTransactions(filter: {
              txHash: {equalTo: "${hash}"}
          }) {
              nodes {
                  id,
                  txHash
              }
          }
      }
      `
    )
    if (nodes.length > 0) return true
    return false
}
