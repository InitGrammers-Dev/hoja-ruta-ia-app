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

export type RoadmapResponse = {
  modules: Module[]
}