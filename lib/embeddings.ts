import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.API_KEY || '');

export async function generateEmbedding(text: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

        // Attempt to force 768 dimensions (if supported by model)
        const result = await model.embedContent({
            content: { role: 'user', parts: [{ text }] },
        });
        return result.embedding.values;
    } catch (error) {
        console.error(`Embedding Failed:`, error);
        throw error;
    }
}
