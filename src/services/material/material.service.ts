import { Material as MaterialModel } from "../../models/material.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";

export class MaterialService {
  static async generateMaterial(subChapterId: string, payload: any) {
    const prompt = PromptService.buildMaterial(payload);
    if (!prompt) {
      throw new Error("Error at initialize generate material prompt");
    }

    const aiResponse = await AIService.generate(prompt);

    const parsedResponse = JSON.parse(aiResponse as string);

    if (!aiResponse) {
      throw new Error("Error at generate material from ai");
    }

    const result = await MaterialModel.create({
      subchapterId: subChapterId,
      content: parsedResponse.content,
      format: parsedResponse.format,
      aiModel: await AIService.getAIModelName(),
      aiPrompt: parsedResponse.aiPrompt,
      userPrompt: parsedResponse.userPrompt,
      tokenUsage: parsedResponse.tokenUsage,
    });
  }
}
