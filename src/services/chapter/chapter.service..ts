import { Chapter as ChapterModel } from "../../models/chapter.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";
import { Section as SectionModel } from "../../models/section.model";

export class ChapterService {
  static async generateChapter(sectionId: string, payload: any) {
    const prompt = PromptService.buildChapterPrompt(payload);

    const aiResponse = await AIService.generate(prompt);

    if (!aiResponse) {
      throw new Error("Error at generate ai chapter service");
    }

    const parsedResponse = JSON.parse(aiResponse);

    let data: any = [];

    for (const chapter of parsedResponse.chapters) {
      data += await ChapterModel.create({
        sectionId,
        order: chapter.order,
        title: chapter.title,
        description: chapter.desciption,
        aiPrompt: "",
        userPrompt: "",
        subchapters: [],
      });
    }
    await SectionModel.updateOne(
      { _id: sectionId },
      {
        chapters: parsedResponse.chapters,
      }
    );

    return data;
  }
}
