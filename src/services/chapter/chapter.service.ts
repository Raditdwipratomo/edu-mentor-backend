import { Chapter as ChapterModel } from "../../models/chapter.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";
import { Section as SectionModel } from "../../models/section.model";
import { SubchapterService } from "../subchapter/subchapter.service";
import {
  ChapterNotFoundException,
  ChapterGenerationException,
} from "../../exceptions/chapter.exceptions";
import { SectionNotFoundException } from "../../exceptions/roadmap.exceptions";
import { GenerateChapterPayload } from "../../type/roadmap.type";
import { AIChapterResponse } from "../../type/roadmap.type";

export class ChapterService {
  constructor(
    private readonly promptService: PromptService,
    private readonly aiService: AIService,
    private readonly subchapterService: SubchapterService // Fixed typo
  ) {}

  async generateChapter(sectionId: string, payload: GenerateChapterPayload) {
    // Validate section exists (with await!)
    const section = await SectionModel.findById(sectionId);
    if (!section) {
      throw new SectionNotFoundException(sectionId);
    }

    // Generate AI content
    const prompt = this.promptService.buildChapterPrompt(payload);
    const aiResponse = await this.aiService.generate(prompt);

    if (!aiResponse) {
      throw new ChapterGenerationException(
        "AI service returned empty response"
      );
    }

    // Parse and validate AI response
    let parsedResponse: AIChapterResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);

      // Validate response structure
      if (!parsedResponse.chapters || !Array.isArray(parsedResponse.chapters)) {
        throw new Error("Invalid AI response structure");
      }
    } catch (error) {
      throw new ChapterGenerationException(
        `Failed to parse AI response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    // Prepare chapters for insertion
    const chaptersToInsert = parsedResponse.chapters.map((chapter, index) => ({
      sectionId,
      order: chapter.order ?? index + 1,
      title: chapter.title,
      description: chapter.description,
      aiPrompt: prompt,
      userPrompt: payload.topic,
    }));

    // Insert chapters
    const createdChapters = await ChapterModel.insertMany(chaptersToInsert);

    // Generate subchapters if requested
    if (payload.withSubChapters) {
      // Consider using Promise.all for parallel execution if order doesn't matter
      await Promise.all(
        createdChapters.map((chapter) =>
          this.subchapterService.generateSubchapters(
            chapter._id.toString(),
            payload
          )
        )
      );

      // Or keep sequential if order matters:
      // for (const chapter of createdChapters) {
      //   await this.subchapterService.generateSubchapters(chapter._id, payload);
      // }
    }

    return createdChapters;
  }

  async getChapterById(chapterId: string) {
    // Removed unused userId
    const chapter = await ChapterModel.findById(chapterId).lean();

    if (!chapter) {
      throw new ChapterNotFoundException(chapterId);
    }

    return chapter;
  }
}
