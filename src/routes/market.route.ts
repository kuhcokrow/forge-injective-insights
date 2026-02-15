import type { FastifyInstance } from 'fastify'
import * as marketController from '../controllers/market.controller'
import { schemas } from '../config/schemas'

export default async function (app: FastifyInstance) {
  app.get('/', { schema: schemas.listMarketsSchema }, marketController.getAllMarkets)
  app.get('/:marketId', { schema: schemas.getMarketSchema }, marketController.getMarketById)
  app.get('/:marketId/orderbook', { schema: schemas.getOrderbookSchema }, marketController.getOrderbook)
  app.get('/:marketId/summary', { schema: schemas.getSummarySchema }, marketController.getSummary)
  app.get('/:marketId/liquidity', { schema: schemas.getLiquiditySchema }, marketController.getLiquidity)
  app.get('/:marketId/analytics', { schema: schemas.getAnalyticsSchema }, marketController.getAnalytics)
  app.get('/rank', { schema: schemas.getRankSchema }, marketController.getRank)
}
