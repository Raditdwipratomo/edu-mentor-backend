import { mongo } from "mongoose";
import { Roadmap as RoadmapModel } from "../../models/roadmap.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";
import { RoadmapPayload } from "./roadmap.type";
import { SectionService } from "./section.service";

export class RoadmapService {
  static async createDraft(userId: string, payload: RoadmapPayload) {
    return await RoadmapModel.create({
      userId,
      interest: payload.interest,
      description: payload.description,
      level: payload.level,
      status: "draft",
    });
  }

  static async generateRoadmap(roadmapId: string) {
    const roadmap = await RoadmapModel.findById(roadmapId);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    if (roadmap.status !== "draft") {
      throw new Error("Roadmap already generated");
    }

    const prompt = PromptService.buildRoadmapPrompt({
      interest: roadmap.interest!,
      level: roadmap.level,
      description: roadmap.description!,
    });

    const aiResponse = await AIService.generate(prompt);

    const parsedResponse = JSON.parse(aiResponse!);

    await RoadmapModel.updateOne(
      { _id: roadmapId },
      {
        title: parsedResponse.title,
        status: "generated",
        aiPrompt: parsedResponse.aiPrompt,
        userPrompt: parsedResponse.userPrompt,
        sections: parsedResponse.sections.map((section: any) => section.id),
        aiModel: await AIService.getAIModelName(),
      }
    );

    const sections = SectionService.bulkGenerate(
      roadmapId,
      parsedResponse.sections
    );

    return parsedResponse;
  }
}
