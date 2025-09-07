import { streamText, convertToCoreMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error('Missing GOOGLE_GENERATIVE_AI_API_KEY');
}

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: `You are Travomine's AI assistant. Help employees create travel quotations.`,
    messages: convertToCoreMessages(messages),
  });

    return result.toUIMessageStreamResponse();
}