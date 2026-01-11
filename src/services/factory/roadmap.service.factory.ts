import { RoadmapService } from "../roadmap/roadmap.service";
import { SectionService } from "../roadmap/section.service";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";
import { ChapterService } from "../chapter/chapter.service";
import { SubchapterService } from "../subchapter/subchapter.service";
import { MaterialService } from "../material/material.service";

export const createRoadmapService = (): RoadmapService => {
  const aiService = new AIService();
  const promptService = new PromptService();
  const sectionService = new SectionService(aiService, promptService);
  return new RoadmapService(aiService, promptService, sectionService);
};

export const createSectionService = (): SectionService => {
  const aiService = new AIService();
  const promptService = new PromptService();

  return new SectionService(aiService, promptService);
};

export const createChapterService = (): ChapterService => {
  const aiService = new AIService();
  const promptService = new PromptService();
  const subchapterService = new SubchapterService(promptService, aiService);

  return new ChapterService(promptService, aiService, subchapterService);
};

export const createSubchapterService = (): SubchapterService => {
  const promptService = new PromptService();
  const aiService = new AIService();

  return new SubchapterService(promptService, aiService);
};

export const createMaterialService = (): MaterialService => {
  const promptService = new PromptService();
  const aiService = new AIService();
  return new MaterialService(promptService, aiService);
};
