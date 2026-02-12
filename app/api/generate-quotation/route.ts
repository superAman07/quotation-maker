import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';
import { pinecone, INDEX_NAME } from '@/lib/pinecone'; // Import Pinecone
import { generateEmbedding } from '@/lib/embeddings';  // Import your embedding function
import { NextRequest } from 'next/server';

// Ensure you have installed: npm install @ai-sdk/google ai

const BASE_SYSTEM_PROMPT = `
You are a professional travel quotation assistant.
Your goal is to generate a structured travel quotation based on the user's request and the provided context.
You MUST return a JSON object with the following structure:
{
  "chatResponse": "A friendly, markdown-formatted summary of the trip for the chat window.",
  "pdfData": {
    "quotationNo": "TLPL-LDH-001",
    "place": "Destination Name",
    "travelDate": "YYYY-MM-DD",
    "groupSize": 4,
    "totalNights": 6,
    "mealPlan": "MAP (Breakfast & Dinner)",
    "flightCost": 0,
    "landCostPerHead": 0,
    "totalGroupCost": 0,
    "accommodation": [
      { "hotelName": "Hotel Name", "roomType": "Room Type", "nights": 2 }
    ],
    "transfers": [
      { "type": "Private Car", "vehicleName": "Innova Crysta" }
    ],
    "itinerary": [
      { "dayTitle": "Arrival", "description": "Detailed description of the day." }
    ],
    "activities": [
      { "name": "Activity Name" }
    ],
    "inclusions": ["List of inclusions"],
    "exclusions": ["List of exclusions"]
  }
}
`;

function extractJSON(text: string) {
  try {
    const match = text.match(/```json([\s\S]*?)```/);
    if (match) return match[1].trim();
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      return text.substring(startIndex, endIndex + 1);
    }
    return text.trim();
  } catch (e) {
    return text.trim();
  }
}

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();
  try {
    // 1. Generate Input Embedding
    const embedding = await generateEmbedding(message);
    // 2. Query Pinecone
    const index = pinecone.Index(INDEX_NAME);
    const queryResponse = await index.query({
      vector: embedding,
      topK: 2,
      includeMetadata: true,
    });
    const contextText = queryResponse.matches
      .map((match) => match.metadata?.text)
      .join('\n\n');
    const finalSystemPrompt = BASE_SYSTEM_PROMPT + "\n\nCONTEXT FROM DATABASE:\n" + contextText;
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.parts?.[0]?.text || '',
    }));
    const result = await generateText({
      model: google('models/gemini-2.5-flash'),
      system: finalSystemPrompt,
      messages: [
        ...formattedHistory,
        { role: 'user', content: message },
      ],
    });
    const cleanedText = extractJSON(result.text);
    return new Response(cleanedText, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate quotation' }), { status: 500 });
  }
}