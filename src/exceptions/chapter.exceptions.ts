export class ChapterNotFoundException extends Error {
  constructor(chapterId: string) {
    super(`Chapter with ID ${chapterId} not found`);
    this.name = "ChapterNotFoundException";
  }
}

export class ChapterGenerationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChapterGenerateException";
  }
}
