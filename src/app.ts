import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

// Adicionando um hook global
// app.addHook('preHandler', async (request) => {
//   console.log(`[${request.method}] ${request.url} [${request.ip}`)
// })

app.register(transactionsRoutes, {
  prefix: '/transactions',
})
