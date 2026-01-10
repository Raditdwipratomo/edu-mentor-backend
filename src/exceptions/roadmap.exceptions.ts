export class RoadmapNotFoundException extends Error {
  constructor(roadmapId: string) {
    super(`Roadmap with ID ${roadmapId} not found`);
    this.name = "RoadmapNotFoundException";
  }
}

export class RoadmapAlreadyGeneratedException extends Error {
  constructor(roadmapId: string) {
    super(`Roadmap with ID ${roadmapId} has already been generated`);
    this.name = "RoadmapAlreadyGeneratedException";
  }
}

export class RoadmapGenerationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoadmapGenerationException";
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedException";
  }
}

export class SectionNotFoundException extends Error {
  constructor(sectionId: string) {
    super(`Section with ID ${sectionId} not found`);
    this.name = "SectionNotFoundException";
  }
}