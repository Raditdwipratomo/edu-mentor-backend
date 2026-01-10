import { roadmapPrompt } from "../../prompts/roadmap";
export class PromptService {
  static buildRoadmapPrompt(payload: {
    interest: string;
    level: string;
    description?: string;
  }) {
    return roadmapPrompt(payload);
  }

  static regenerateRoadmapPrompt(payload: any) {
    return "";
  }

  static buildChapterPrompt(payload: any) {
    return "";
  }

  static regenerateChapterPrompt(payload: any) {
    return "";
  }
  static generateSubChapter(payload: any) {
    return "";
  }
  static buildMaterial(payload: any) {
    return "";
  }
  static regenerateMaterial(payload: any) {}
}
