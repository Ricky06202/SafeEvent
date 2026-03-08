import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello from Hono (Root)!')
})

app.get('/api', (c) => {
  return c.text('Hello from Hono (/api)!')
})

app.get('/api/', (c) => {
  return c.text('Hello from Hono (/api/) con barra al final!')
})

app.all('*', (c) => {
  return c.text(`404 Custom - Debug Info: Method=${c.req.method}, Path=${c.req.path}, URL=${c.req.url}`)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
