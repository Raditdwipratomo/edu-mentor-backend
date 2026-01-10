import { roadmapPrompt } from "../../prompts/roadmap";
import { RoadmapPayload } from "../../type/roadmap.type";
export class PromptService {
  buildRoadmapPrompt(payload: RoadmapPayload) {
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
