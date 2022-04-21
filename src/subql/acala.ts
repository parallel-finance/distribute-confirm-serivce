import { gql, request } from 'graphql-request'

const url = process.env.ACALA_SUBQL_ENDPOINT

export async function acalaHashExist(hash: string): Promise<boolean> {
    const { distributionTxes: { nodes } } = await request(
        url,
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