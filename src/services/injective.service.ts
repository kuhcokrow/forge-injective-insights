import { IndexerGrpcSpotApi } from "@injectivelabs/sdk-ts"
import { getNetworkEndpoints, Network } from "@injectivelabs/networks"

const network = Network.Mainnet
const endpoints = getNetworkEndpoints(network)

export const spotApi = new IndexerGrpcSpotApi(endpoints.indexer)