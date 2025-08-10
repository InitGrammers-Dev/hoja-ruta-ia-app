import 'dotenv/config'
import type { RoadmapResponse } from "../types/roadmap"

export async function callGemini(prompt: string): Promise<RoadmapResponse> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("Falta la clave GEMINI_API_KEY en el .env")
  }

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey
    },
    body: JSON.stringify(body)
  })

  const data: any = await res.json()

  if (!res.ok) {
    throw new Error(data.error?.message || "Error llamando a la API Gemini")
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!rawText) {
    throw new Error("La respuesta de Gemini no contiene texto")
  }

  const cleanedText = rawText
    .replace(/^\s*```json\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  return JSON.parse(cleanedText) as RoadmapResponse
}
