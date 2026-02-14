import { spotApi } from "./injective.service";

export async function getAllMarkets() {
  const markets = await spotApi.fetchMarkets()

  return markets.map((m: any) => ({
    marketId: m.marketId,
    ticker: m.ticker,
    quoteDenom: m.quoteDenom,
    baseDenom: m.baseDenom,
    status: m.marketStatus,
  }))
}

export async function getMarketById(marketId: string) {
  const markets = await spotApi.fetchMarkets()
  const market = markets.find((m: any) => m.marketId === marketId)

  if (!market) {
    throw new Error(`Market with ID ${marketId} not found`)
  }

  return market
}

export async function fetchOrderbook(marketId: string) {
  const order = await spotApi.fetchOrderbookV2(marketId)
  return {
    buys: order.buys,
    sells: order.sells
  }
}