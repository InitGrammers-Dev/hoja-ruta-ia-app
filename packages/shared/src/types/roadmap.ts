export type Resource = {
  type: string;
  title: string;
  description: string;
  url?: string;
};

export type Module = {
  title: string;
  summary: string;
  resources: Resource[];
};

export type RoadmapContent = {
  modules: Module[];
};

export type Roadmap = {
  id: string;
  topic: string;
  content: RoadmapContent;
  createdAt: string;
};
