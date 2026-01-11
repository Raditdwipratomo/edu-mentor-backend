import { Request } from "express";

export enum RoadmapStatus {
  DRAFT = "draft",
  GENERATED = "generated",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface RoadmapPayload {
  interest: string;
  userPrompt?: string;
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

export interface GenerateChapterPayload {
  topic: string;
  withSubChapters?: boolean;
}

export interface AIChapterResponse {
  chapters: Array<{
    order?: number;
    title: string;
    description: string;
  }>;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}
