import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import marketRoutes from './routes/market.route'
import { swaggerOptions, swaggerUIOptions } from './config/swagger'

export async function build() {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    },
  })

  await app.register(cors)
  
  await app.register(swagger, swaggerOptions)
  await app.register(swaggerUI, swaggerUIOptions)

  await app.register(marketRoutes, { prefix: '/api/markets' })

  return app
}