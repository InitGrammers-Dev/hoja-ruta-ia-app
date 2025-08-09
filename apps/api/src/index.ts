declare const Bun: any

import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

// Schema de la request para /generate-roadmap
const generateRoadmapSchema = z.object({
  topic: z.string().min(3)
})

app.post('/generate-roadmap', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = generateRoadmapSchema.parse(body)

    // Aquí llamarías a la API Gemini (por ahora simulamos)
    const roadmap = {
      topic: parsed.topic,
      modules: [
        { id: 1, title: 'Introducción', content: 'Contenido básico...' },
        { id: 2, title: 'Avanzado', content: 'Contenido avanzado...' }
      ]
    }

    return c.json({ roadmap })
  } catch (error) {
    return c.json({ error: error.message }, 400)
  }
})

// En lugar de app.fire(), usa Bun.serve con app.fetch:
Bun.serve({
  port: 3000,
  fetch: app.fetch,
})

console.log('🚀 Servidor escuchando en http://localhost:3000')