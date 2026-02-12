import { streamText, convertToCoreMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { prisma } from '@/lib/prisma';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const lastUserMessage = typeof lastMessage.content === 'string'
    ? lastMessage.content
    : lastMessage.parts?.[0]?.text || '';

  let context = '';

  const match = lastUserMessage.match(/(Q-\d{6,}-[A-Z0-9]+)/i);

  if (match) {
    const quotationNo = match[1].toUpperCase();
    console.log(`🧠 AI Assistant: Detected Quotation ID: ${quotationNo}`);

    const quotation = await prisma.quotation.findUnique({
      where: { quotationNo },
      include: {
        accommodations: true,
        transfers: true,
        flights: true,
        itinerary: true,
        inclusions: true,
        exclusions: true,
        activities: true,
        mealPlan: true
      },
    });

    if (quotation) {
      const activityList = quotation.activities.map(a => a.name).join(', ') || 'None';
      const flightList = quotation.flights.map(f => `${f.type}: ${f.route} (${f.date.toISOString().split('T')[0]})`).join(', ') || 'None';
      const hotelList = quotation.accommodations.map(h => `${h.hotelName} (${h.roomType})`).join(', ') || 'None';

      context = `
      **🎯 ACTIVE QUOTATION CONTEXT (${quotationNo}):**
      - **Client:** ${quotation.clientName}
      - **Destination:** ${quotation.place} (${quotation.totalNights} Nights)
      - **Meal Plan:** ${quotation.mealPlan?.name || 'Not specified'}
      - **Budget:** ₹${quotation.totalGroupCost?.toLocaleString() || 'N/A'} Total
      
      **✈️ FLIGHTS:** ${flightList}
      **🏨 HOTELS:** ${hotelList}
      **🌴 ACTIVITIES:** ${activityList}

      **📅 ITINERARY SUMMARY:** 
      ${quotation.itinerary.map((d, i) => `  Day ${i + 1}: ${d.dayTitle}`).join('\n')}
      `;
    } else {
      context = `**⚠️ NOTICE:** User asked about ${quotationNo}, but it was not found in the database.`;
    }
  }

  /* 
   * NEW SYSTEM PROMPT: Travel Consultant Mode
   */
  const systemPrompt = `
  You are an expert Travel Consultant at Travomine. Your goal is to design the perfect trip for the client.

  **YOUR PROCESS:**
  1.  **Analyze Request**: If the user's request is vague (e.g., "Plan a trip to Kerala"), ASK 2-3 clarifying questions (Budget? Duration? Preferences?).
  2.  **Gather Details**: Don't just generate a generic itinerary. Try to understand their "vibe" (Luxury? Backpacking? Family?).
  3.  **Generate Proposal**: ONLY when you have enough information, generate a Structured JSON quotation.

  **FORMATTING:**
  - Use Markdown for your responses (Bold, Bullet points).
  - Keep your tone professional, warm, and helpful.
  - Do NOT say "I am an AI". You are a consultant.
  
  **CRITICAL:**
  - If the user provides details, acknowledge them clearly.
  - If asked to generate the final PDF/Quotation, output a specific trigger phrase or tool call (handled by client).
  
  ${context ? `\n\n**CONTEXT FROM DATABASE:**\n${context}` : ''}
  `;

  const result = await streamText({
    model: google('models/gemini-1.5-flash-001'), // Fixing the 404 error with explicit version
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return result.toTextStreamResponse();
}