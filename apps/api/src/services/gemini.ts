export type GeminiResponse = any

export async function callGemini(payload: unknown): Promise<GeminiResponse> {
  const endpoint = process.env.GEMINI_API_ENDPOINT
  const key = process.env.GEMINI_API_KEY

  if (!endpoint || !key) {
    throw new Error('Falta configurar GEMINI_API_ENDPOINT o GEMINI_API_KEY en env')
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data
}
