import { gql, request } from 'graphql-request'

const url = process.env.MOONBEAM_SUBQL_ENDPOINT
console.log(url)

export async function moonbeamHashExist(hash: string): Promise<boolean> {
    const { distributedTransactions: { nodes } } = await request(
        url,
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