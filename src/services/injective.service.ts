import { IndexerGrpcSpotApi } from "@injectivelabs/sdk-ts"
import { getNetworkEndpoints, Network } from "@injectivelabs/networks"

const network = Network.Testnet
const endpoints = getNetworkEndpoints(network)

export const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)