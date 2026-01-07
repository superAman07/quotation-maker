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
      ${quotation.itinerary.map((d, i) => `  Day ${i+1}: ${d.dayTitle}`).join('\n')}
      `;
    } else {
      context = `**⚠️ NOTICE:** User asked about ${quotationNo}, but it was not found in the database.`;
    }
  }

  const systemPrompt = `
  You are 'Travomine Assist', an advanced AI travel operations expert. Your goal is to help travel agents work faster.

  **YOUR KEY SKILLS:**

  1.  **📝 TEXT REFACTORING (High Priority)**
      - If the user pastes raw, messy, or lower-case text (e.g., flight schedules, hotel descriptions, lists), REWRITE it immediately into a clean, professional format.
      - **Example Input:** "arrival at delhi airport then go to agra see taj mahal night stay hotel"
      - **Example Output:** "**Day 1: Arrival in Delhi & Transfer to Agra**\nUpon arrival at Delhi Airport, you will be greeted by our representative and transferred to Agra. Proceed to visit the magnificent Taj Mahal. Overnight stay at the hotel."

  2.  **💬 QUOTATION INTELLIGENCE**
      - If 'ACTIVE QUOTATION CONTEXT' is provided below, use it to answer questions like "What hotels are booked?" or "Write a welcome email for this client including their flight details."

  3.  **🗺️ ITINERARY GENERATION**
      - If asked to create an itinerary (e.g., "Give me a 3-day plan for Dubai"), generate a detailed, logical day-wise plan with "Morning", "Afternoon", and "Evening" sections.

  **TONE & RULES:**
  - Be professional, concise, and sales-oriented.
  - Do NOT mention being an AI, Gemini, or Google. You are part of the Travomine system.
  - Format output with Markdown (Bold, Lists) for readability.

  ${context ? `\n${context}` : ''}
  `;

  const result = await streamText({
    model: google('gemini-2.0-flash'),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}