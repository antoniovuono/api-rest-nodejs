import { env } from './envs'
import { app } from './app'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server is running on port 3333')
  })
