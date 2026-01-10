import { Chapter as ChapterModel } from "../../models/chapter.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";
import { Section as SectionModel } from "../../models/section.model";
import { SubchapterService } from "../subchapter/subchapter.service";

export class ChapterService {
  constructor() {}
  async generateChapter(sectionId: string, payload: any) {
    const section = SectionModel.findById(sectionId);

    if (!section) {
      throw new Error("Section not found");
    }
    const prompt = PromptService.buildChapterPrompt(payload);

    const aiResponse = await AIService.generate(prompt);

    if (!aiResponse) {
      throw new Error("Error at generate ai chapter service");
    }

    const parsedResponse = JSON.parse(aiResponse);

    const chaptersToInsert = parsedResponse.chapters.map(
      (chapter: any, index: number) => ({
        sectionId,
        order: chapter.order ?? index + 1,
        title: chapter.title,
        description: chapter.description,
        aiPrompt: prompt,
        userPrompt: payload.topic,
      })
    );

    const createdChapters = await ChapterModel.insertMany(chaptersToInsert);

    if (payload.withSubChapters) {
      for (const chapter of createdChapters) {
        await SubchapterService(chapter._id, payload);
      }
    }

    return createdChapters;
  }
}
