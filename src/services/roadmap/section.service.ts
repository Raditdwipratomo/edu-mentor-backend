import { ClientSession } from "mongoose";
import { Section as SectionModel } from "../../models/section.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";
import { SectionNotFoundException } from "../../exceptions/roadmap.exceptions";
import { SectionPayload } from "../../type/roadmap.type";
import { Chapter as ChapterModel } from "../../models/chapter.model";

export class SectionService {
  constructor(
    private readonly aiService: AIService,
    private readonly promptService: PromptService
  ) {}
  async bulkGenerate(
    roadmapId: string,
    sections: Array<{ order: number; title: string; description: string }>,
    session?: ClientSession
  ): Promise<any[]> {
    try {
      const sectionsToCreate = sections.map((section) => ({
        roadmapId,
        order: section.order,
        title: section.title,
        description: section.description,
      }));

      const options = session ? { session } : {};
      const createdSections = await SectionModel.insertMany(
        sectionsToCreate,
        options
      );

      return createdSections;
    } catch (error) {
      throw new Error(`Failed to create sections: ${error}`);
    }
  }

  async getSectionById(sectionId: string): Promise<any> {
    const section = await SectionModel.findById(sectionId).lean();

    if (!section) {
      throw new SectionNotFoundException(sectionId);
    }

    return section;
  }

  async getSectionsByRoadmapId(roadmapId: string): Promise<any> {
    const sections = await SectionModel.find({ roadmapId })
      .sort({ order: 1 })
      .lean();

    return sections;
  }

  async generateChaptersFromAI(sectionId: string): Promise<any> {
    const section = await this.getSectionById(sectionId);

    const prompt = this.promptService.buildChapterPrompt({
      sectionTitle: section.title,
      sectionDescription: section.description,
    });

    const aiResponse = await this.aiService.generate(prompt);
    const parsedResponse = JSON.parse(aiResponse as string);

    await ChapterModel.insertMany(parsedResponse.chapters);

    return parsedResponse.chapters;
  }

  async updateSection(
    sectionId: string,
    updates: Partial<SectionPayload>
  ): Promise<any> {
    const section = await SectionModel.findByIdAndUpdate(sectionId, updates, {
      new: true,
      runValidators: true,
    });

    if (!section) {
      throw new SectionNotFoundException(sectionId);
    }

    return section;
  }

  async deleteSectionByRoadmapId(roadmapId: string, session?: ClientSession) {
    const options = session ? { session } : {};
    await SectionModel.deleteMany({ roadmapId }, options);
  }

  async deleteSection(sectionId: string): Promise<void> {
    const result = await SectionModel.deleteOne({ _id: sectionId });

    if (result.deletedCount === 0) {
      throw new SectionNotFoundException(sectionId);
    }
  }

  async deleteChaptersBySectionId() {}
}
