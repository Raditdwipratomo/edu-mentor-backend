import { groq } from "../../config";

export class AIService {
  static async generate(prompt: string) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an educational AI mentor." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  }

  static async getAIModelName(): Promise<string> {
    return "llama";
  }
}
