export type Resource = {
  type: string
  title: string
  description: string
  url?: string
}

export type Module = {
  title: string
  summary: string
  resources: Resource[]
}

// Esto representa solo la propiedad `content`
export type RoadmapResponse = {
  modules: Module[]
}

// Esto representa el roadmap completo que devuelve tu API
export type Roadmap = {
  id: string
  topic: string
  content: RoadmapResponse
  createdAt: string
}
