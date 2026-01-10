import { Section as SectionModel } from "../../models/section.model";

export class SectionService {
  static async bulkGenerate(
    roadmapId: string,
    sections: Array<{ order: number; title: string; description: string }>
  ) {
    const createdSections = await SectionModel.insertMany(
      sections.map((section) => ({
        roadmapId,
        order: section.order,
        title: section.title,
        desciption: section.description,
      }))
    );

    return createdSections;
  }
}
