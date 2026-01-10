import { Response, Request, NextFunction } from "express";
import { RoadmapService } from "../../services/roadmap/roadmap.service";
import { StatusCodes } from "http-status-codes";
import { ChapterService } from "../../services/chapter/chapter.service.";
import { success } from "zod";
import { SubchapterService } from "../../services/subchapter/subchapter.service";
import { MaterialService } from "../../services/material/material.service";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  createDraft = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "User authentication required!",
        });
        return;
      }

      const createDto = req.body;

      const roadmap = await this.roadmapService.createDraft(userId, createDto);

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: roadmap,
        message: "Draft roadmap created successfully",
      });
    } catch (error) {
      next(error);
      console.error("Error: ", error);
    }
  };

  generateRoadmap = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const roadmapId = req.params.roadmapId;

      if (!roadmapId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Must include roadmapId",
        });
        return;
      }

      const roadmap = this.roadmapService.generateRoadmap(roadmapId);

      res.status(StatusCodes.OK).json({
        success: true,
        data: roadmap,
        message: "Roadmap successfully generated",
      });
    } catch (error) {
      next(error);
      console.error("Error: ", error);
    }
  };
}

export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  generateChapter = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sectionId } = req.params;
      const payload = req.body;

      if (!sectionId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Section Id is required",
        });
        return;
      }

      const chapters = this.chapterService.generateChapter(sectionId, payload);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "",
        data: chapters,
      });
    } catch (error) {
      console.error("Error: ", error);
      next(error);
    }
  };
}

export class SubchapterController {
  constructor(private readonly subchapterService: SubchapterService) {}

  generateSubchapters = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { chapterId } = req.params;

      if (!chapterId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Chapter ID is required!",
          success: false,
        });

        return;
      }

      const subchapters = this.subchapterService.generateSubchapters(
        chapterId,
        req.body
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: subchapters,
        messsage: "Subchapter's sucessfully generated",
      });
    } catch (error) {
      console.error("Error: ", error);
      next(error);
    }
  };
}

export class MaterialControlller {
  constructor(private readonly materialService: MaterialService) {}
}
