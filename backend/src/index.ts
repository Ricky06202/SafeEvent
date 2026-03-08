import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { cors } from 'hono/cors'

const app = new Hono().basePath('/api')

app.use('*', trimTrailingSlash())

app.use('*', cors({
  origin: ['https://safeevent.rsanjur.com'],
  credentials: true,
}))

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Hono API!',
    status: 'success'
  })
})

serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000
}, (info) => {
  console.log(`Server is running on port ${info.port}`)
})
