import { env } from './envs'
import { app } from './app'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP server is running on port 3333')
  })
