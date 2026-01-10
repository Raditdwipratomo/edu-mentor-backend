import { ClientSession, mongo } from "mongoose";
import { Roadmap as RoadmapModel } from "../../models/roadmap.model";
import { AIService } from "../ai/ai.service";
import { PromptService } from "../ai/prompt.service";
import {
  RoadmapPayload,
  GeneratedRoadmapResponse,
  RoadmapStatus,
} from "../../type/roadmap.type";
import {
  RoadmapNotFoundException,
  RoadmapAlreadyGeneratedException,
  RoadmapGenerationException,
  UnauthorizedException,
} from "../../exceptions/roadmap.exceptions";
import { SectionService } from "./section.service";

export class RoadmapService {
  constructor(
    private readonly aiService: AIService,
    private readonly promptService: PromptService,
    private readonly sectionService: SectionService
  ) {}

  async createDraft(userId: string, payload: RoadmapPayload): Promise<any> {
    try {
      const roadmap = await RoadmapModel.create({
        userId,
        interest: payload.interest,
        level: payload.level,
        status: RoadmapStatus.DRAFT,
      });

      return roadmap;
    } catch (error) {
      throw new RoadmapGenerationException(
        `Failed to create draft roadmap: ${error}`
      );
    }
  }

  async generateRoadmap(
    roadmapId: string,
    userId: string
  ): Promise<GeneratedRoadmapResponse> {
    const session: ClientSession = await RoadmapModel.startSession();
    session.startTransaction();
    try {
      const roadmap = await this.getRoadmapWithValidation(
        roadmapId,
        userId,
        session
      );

      this.validateRoadmapStatus(roadmap);

      const prompt = this.promptService.buildRoadmapPrompt({
        interest: roadmap.interest!,
        level: roadmap.level,
        description: roadmap.description!,
      });

      const aiResponse = await this.aiService.generate(prompt);

      const parsedResponse = this.parseAIResponse(aiResponse);

      await this.updateRoadmapWithGeneratedContent(
        roadmapId,
        parsedResponse,
        session
      );

      const sections = await this.sectionService.bulkGenerate(
        roadmapId,
        parsedResponse.sections,
        session
      );

      await session.commitTransaction();

      return { ...parsedResponse, sections };
    } catch (error) {
      await session.abortTransaction();

      if (
        error instanceof RoadmapNotFoundException ||
        error instanceof RoadmapAlreadyGeneratedException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new RoadmapGenerationException(
        `Failed to generate roadmap: ${error}`
      );
    } finally {
      session.endSession();
    }
  }

  async getRoadmapById(roadmapId: string, userId: string): Promise<any> {
    const roadmap = await RoadmapModel.findById(roadmapId)
      .populate("sections")
      .lean();

    if (!roadmap) {
      throw new RoadmapNotFoundException(roadmapId);
    }

    if (roadmap.userId.toString() !== userId) {
      throw new UnauthorizedException(
        "You dont have permission to access this roadmap"
      );
    }

    return roadmap;
  }

  async getUserRoadmaps(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: RoadmapStatus;
    } = {}
  ): Promise<{
    roadmaps: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  } | void> {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const filter: any = { userId };

    if (status) {
      filter.status = status;
    }

    const [roadmaps, total] = await Promise.all([
      RoadmapModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RoadmapModel.countDocuments(filter),
    ]);

    return {
      roadmaps,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteRoadmap(roadmapId: string, userId: string): Promise<void> {
    const session = await RoadmapModel.startSession();
    session.startTransaction();

    try {
      const roadmap = await RoadmapModel.findById(roadmapId);

      if (!roadmap) {
        throw new RoadmapNotFoundException(roadmapId);
      }

      if (roadmap.userId.toString() !== userId) {
        throw new UnauthorizedException(
          "You dont have permission to delete this roadmap"
        );
      }

      await this.sectionService.deleteSectionByRoadmapId(roadmapId);

      await RoadmapModel.deleteOne({ _id: roadmapId });
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  // Private Helper Methods

  private async getRoadmapWithValidation(
    roadmapId: string,
    userId: string,
    session: ClientSession
  ) {
    const roadmap = await RoadmapModel.findById(roadmapId).session(session);

    if (!roadmap) {
      throw new RoadmapNotFoundException(roadmapId);
    }

    if (roadmap.userId.toString() !== userId) {
      throw new UnauthorizedException(
        "You dont have permission to generate this roadmap"
      );
    }

    return roadmap;
  }

  private validateRoadmapStatus(roadmap: any): void {
    if (roadmap.status !== RoadmapStatus.DRAFT) {
      throw new RoadmapAlreadyGeneratedException(roadmap._id.toString());
    }
  }

  private parseAIResponse(aiResponse: string | null) {
    if (!aiResponse) {
      throw new RoadmapGenerationException("AI service return empty responses");
    }

    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      throw new RoadmapGenerationException(
        `Failed to parse AI Response: ${error}`
      );
    }
  }

  private async updateRoadmapWithGeneratedContent(
    roadmapId: string,
    parsedResponse: any,
    session: ClientSession
  ): Promise<void> {
    await RoadmapModel.updateOne(
      { _id: roadmapId },
      {
        title: parsedResponse.title,
        status: RoadmapStatus.GENERATED,
        aiPrompt: parsedResponse.aiPrompt,
        userPrompt: parsedResponse.userPrompt,
        aiModel: await this.aiService.getAIModelName(),
        description: parsedResponse.description,
      },
      { session }
    );
  }
}
