import { streamText, convertToCoreMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { prisma } from '@/lib/prisma';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUserMessage = messages[messages.length - 1]?.parts?.[0]?.text || '';

  let context = '';

  const match = lastUserMessage.match(/(q-[a-z0-9-]+)/i);
  if (match) {
    const quotationNo = match[1];
    console.log(`AI Assistant: Found quotation number in message: ${quotationNo}`);

    const quotation = await prisma.quotation.findUnique({
      where: { quotationNo },
      include: { accommodations: true, transfers: true, itinerary: true, inclusions: true, exclusions: true, activities: true, mealPlan: true },
    });
    console.log('AI Assistant: Prisma query result:', quotation);

    if (quotation) {
      context = `Data for quotation ${quotationNo}:\n` + JSON.stringify(quotation, null, 2);
    } else {
      context = `No data found for quotation number ${quotationNo}.`;
    }
  }

  const systemPrompt = `You are Travomine's AI assistant, created by Aman Vishwakarma (superAman, https://github.com/superAman07).
    **CRITICAL INSTRUCTIONS:**
    1.  **Data Source**: You MUST ONLY use the information provided in the "CONTEXT" section below to answer questions.
    2.  **No Outside Knowledge**: Do NOT use any of your own knowledge or make up any information.
    3.  **Data Not Found**: If the CONTEXT section is empty or says "No data found", you MUST reply with the exact phrase: "I could not find any information for that query in the database."
    4.  **Identity**: Never mention you are a Google model. You are a proprietary AI for Travomine.

    **CONTEXT:**
    ---
    ${context || 'No context provided.'}
    ---
    `;

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}