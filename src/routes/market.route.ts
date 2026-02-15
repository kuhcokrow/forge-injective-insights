import type { FastifyInstance } from 'fastify'
import * as marketController from '../controllers/market.controller'

export default async function (app: FastifyInstance) {
  app
    .get('/', marketController.getAllMarkets)
    .get('/:marketId', marketController.getMarketById)
    .get('/:marketId/orderbook', marketController.getOrderbook)
    .get('/:marketId/summary', marketController.getSummary)
    .get('/:marketId/liquidity', marketController.getLiquidity)
    .get('/:marketId/analytics', marketController.getAnalytics)
    .get('/rank', marketController.getRank)
  
}