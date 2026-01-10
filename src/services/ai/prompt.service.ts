import { roadmapPrompt } from "../../prompts/roadmap";
export class PromptService {
  buildRoadmapPrompt(payload: {
    interest: string;
    level: string;
    description?: string;
  }) {
    return roadmapPrompt(payload);
  }

  regenerateRoadmapPrompt(payload: any) {
    return "";
  }

  buildChapterPrompt(payload: any) {
    return "";
  }

  regenerateChapterPrompt(payload: any) {
    return "";
  }
  generateSubChapter(payload: any) {
    return "";
  }
  buildMaterial(payload: any) {
    return "";
  }
  regenerateMaterial(payload: any) {}
}
