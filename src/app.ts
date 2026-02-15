import Fastify from 'fastify'
import cors from '@fastify/cors'
import marketRoutes from './routes/market.route'

export async function build() {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    },
  })

  await app.register(cors)

  await app.register(marketRoutes, { prefix: '/api/markets' })

  return app
}