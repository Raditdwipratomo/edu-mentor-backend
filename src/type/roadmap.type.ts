export enum RoadmapStatus {
  DRAFT = "draft",
  GENERATED = "generated",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface RoadmapPayload {
  interest: string;
  description: string;
  level: string;
}

export interface GeneratedRoadmapResponse {
  title: string;
  aiPrompt: string;
  userPrompt: string;
  sections: any[];
}

export interface SectionPayload {
  order: number;
  title: string;
  description: string;
}