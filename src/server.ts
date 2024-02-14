import fastify from 'fastify'
import { knex } from './database'
import { env } from './envs'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions')
    .where('amount', 100)
    .select('*')
  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server is running on port 3333')
  })
