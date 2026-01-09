import { Subchapter as SubchapterModel } from "../../models/sub-chapter.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";
import { Chapter as ChapterModel } from "../../models/chapter.model";

export class SubchapterService {
  static async generateSubchapter(chapterId: string, payload: any) {
    const prompt = PromptService.generateSubChapter(payload);

    if (!prompt) {
      throw new Error("Error at initialize prompt");
    }

    const aiResponse = await AIService.generate(prompt);

    if (!aiResponse) {
      throw new Error("Error at generating subchapter from ai");
    }

    const parsedResponse = JSON.parse(aiResponse);

    let data: any = [];

    for (const subchapter of parsedResponse.subChapters) {
      data += await SubchapterModel.create({
        chapterId,
        title: subchapter.title,
        learningObjective: subchapter.learningObjective,
        aiPrompt: subchapter.aiPrompt,
        userPrompt: subchapter.userPrompt,
      });
    }

    await ChapterModel.updateOne(
      { _id: chapterId },
      {
        subchapters: parsedResponse.subChapters,
      }
    );

    return data;
  }
}
