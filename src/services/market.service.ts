import { liquidityMetric } from "../utils/liquidity";
import { calculateSpread } from "../utils/formater";
import { spotApi } from "./injective.service";

export const getAllMarkets = async () => {
  const markets = await spotApi.fetchMarkets()

  return markets.map((m: any) => ({
    marketId: m.marketId,
    ticker: m.ticker,
    quoteDenom: m.quoteDenom,
    baseDenom: m.baseDenom,
    status: m.marketStatus,
  }))
}

export const getMarketById = async (marketId: string) => {
  const markets = await spotApi.fetchMarkets()
  const market = markets.find((m: any) => m.marketId === marketId)

  if (!market) {
    throw new Error(`Market with ID ${marketId} not found`)
  }

  return market
}

export const fetchOrderbook = async (marketId: string) => {
  const order = await spotApi.fetchOrderbookV2(marketId)
  return {
    buys: order.buys,
    sells: order.sells
  }
}

export const fetchMarketSummary = async (marketId: string) => {
  const markets = await spotApi.fetchMarkets()
  const market = markets.find((m: any) => m.marketId === marketId)

  if (!market) throw new Error(`Market with ID ${marketId} not found`)
  
  const orderbook = await spotApi.fetchOrderbookV2(marketId)

  const topBid = orderbook.buys.length > 0 ? Number(orderbook.buys[0]?.price) : 0
  const topAsk = orderbook.sells.length > 0 ? Number(orderbook.sells[0]?.price) : 0
  
  console.log(`[fetchMarketSummary] ${marketId}:`, { topBid, topAsk, buysCount: orderbook.buys.length, sellsCount: orderbook.sells.length })
  
  return {
    marketId: market.marketId,
    ticker: market.ticker,
    marketStatus: market.marketStatus,
    topBid,
    topAsk,
    spread: calculateSpread(topBid, topAsk)
  }
}

export const fetchLiquidity = async (marketId: string) => {
  const orderbook = await spotApi.fetchOrderbookV2(marketId)
  
  const buys = orderbook.buys.map((b: any) => ({ ...b, price: Number(b.price) }))
  const sells = orderbook.sells.map((s: any) => ({ ...s, price: Number(s.price) }))
  
  const metrics = liquidityMetric(buys, sells)
  
  return {
    marketId,
    ...metrics
  }
}

export const fetchFullMarketData = async (marketId: string) => {
  const [summary, liquidity] = await Promise.all([
    fetchMarketSummary(marketId),
    fetchLiquidity(marketId)
  ])

  return {
    summary,
    liquidity
  }
}