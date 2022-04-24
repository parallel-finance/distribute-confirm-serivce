import { gql, request } from 'graphql-request'
import config from '../config';

const { ACALA_SUBQL_ENDPOINT } = config();

export async function acalaHashExist(hash: string): Promise<boolean> {
    const { distributionTxes: { nodes } } = await request(
        ACALA_SUBQL_ENDPOINT,
        gql`
        query {
            distributionTxes(filter: {
                id: {includes: "${hash}"}
            }) {
                nodes {
                    id
                }
            }
        }
        `
    )
    if (nodes.length > 0) return true
    return false
}
