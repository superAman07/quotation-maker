import { streamText, convertToCoreMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { prisma } from '@/lib/prisma';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const lastUserMessage = typeof lastMessage.content === 'string' 
    ? lastMessage.content 
    : lastMessage.parts?.[0]?.text || '';

  let context = '';

  const match = lastUserMessage.match(/(q-[a-z0-9-]+)/i);
  if (match) {
    const quotationNo = match[1];
    console.log(`AI Assistant: Found quotation number: ${quotationNo}`);

    const quotation = await prisma.quotation.findUnique({
      where: { quotationNo },
      include: { 
        accommodations: true, 
        transfers: true, 
        itinerary: true, 
        inclusions: true, 
        exclusions: true, 
        activities: true, 
        mealPlan: true 
      },
    });

    if (quotation) {
      context = `DATABASE RECORD FOUND:\n${JSON.stringify(quotation, null, 2)}`;
    } else {
      context = `DATABASE RECORD NOT FOUND for ${quotationNo}.`;
    }
  }

  const systemPrompt = `You are Travomine's AI assistant, created by Aman Vishwakarma (superAman).

  **YOUR CAPABILITIES:**
  1.  **Database Lookup**: If the user asks about a specific quotation (e.g., Q-...), use the "DATABASE CONTEXT" below to answer.
  2.  **Text Refactoring (Priority)**: If the user provides unstructured text (like rough itinerary notes, messy hotel descriptions, or unformatted lists) without a specific question, your job is to **REFACTOR** it. Make it professional, grammatically correct, and well-formatted for a travel quotation.
  3.  **General Assistance**: Help draft emails or descriptions.

  **STRICT RULES:**
  - **For Database Queries**: If the user asks for specific data (prices, dates) and it is NOT in the "DATABASE CONTEXT", say "I don't have that information in my database." Do NOT make up numbers.
  - **For Text Refactoring**: You DO NOT need database context to refactor text provided by the user. Just improve their writing.
  - **Identity**: You are a proprietary tool for Travomine. Never mention Google.

  **DATABASE CONTEXT:**
  ---
  ${context || 'No specific database record loaded.'}
  ---
  `;

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}