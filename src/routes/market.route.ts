import type { FastifyInstance } from 'fastify'
import * as marketController from '../controllers/market.controller'

export default async function (app: FastifyInstance) {
  app.get('/', async () => {
    return await marketController.getAllMarkets()
  })

  app.get('/:marketId', async (request) => {
    const { marketId } = request.params as { marketId: string }
    return await marketController.getMarketById(marketId)
  })

  app.get('/:marketId/orderbook', async (request) => {
    const { marketId } = request.params as { marketId: string }
    return await marketController.getOrderbook(marketId)
  })
}