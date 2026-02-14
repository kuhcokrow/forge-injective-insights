import * as marketService from '../services/market.service' 

export async function getAllMarkets() {
  return await marketService.getAllMarkets()
}

export async function getMarketById(marketId: string) {
  return await marketService.getMarketById(marketId)
}

export async function getOrderbook(marketId: string) {
  return await marketService.fetchOrderbook(marketId)
}