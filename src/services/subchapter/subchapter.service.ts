import { Subchapter as SubchapterModel } from "../../models/sub-chapter.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";

export class SubchapterService {
  constructor(
    private readonly promptService: PromptService,
    private readonly aiService: AIService
  ) {}

  async generateSubchapters(chapterId: string, payload: any) {
    const prompt = this.promptService.generateSubChapter(payload);

    const aiResponse = await this.aiService.generate(prompt);

    if (!aiResponse) {
      throw new Error("AI subchapter generate failed");
    }

    const parsedResponse = JSON.parse(aiResponse as string);

    return SubchapterModel.insertMany(
      parsedResponse.subchapters.map((sc: any, index: number) => ({
        chapterId,
        order: sc.order ?? index + 1,
        title: sc.title,
        learningObjective: sc.learningObjective,
        aiPrompt: "",
        userPrompt: "",
      }))
    );
  }
}
