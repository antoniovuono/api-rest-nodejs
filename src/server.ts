import fastify from 'fastify'
import { env } from './envs'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)

// Adicionando um hook global
// app.addHook('preHandler', async (request) => {
//   console.log(`[${request.method}] ${request.url} [${request.ip}`)
// })

app.register(transactionsRoutes, {
  prefix: '/transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server is running on port 3333')
  })
