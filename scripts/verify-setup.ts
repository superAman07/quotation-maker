import 'dotenv/config';
import { pinecone, INDEX_NAME } from '../lib/pinecone';
import { generateEmbedding } from '../lib/embeddings';

async function main() {
    console.log("--- 🕵️ Config Check ---");
    const pineconeKey = process.env.PINECONE_API_KEY;
    console.log("PINECONE_API_KEY:", pineconeKey ? "✅ Set" : "❌ MISSING");

    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.API_KEY;
    console.log("GOOGLE_GENERATIVE_AI_API_KEY:", googleKey ? "✅ Set" : "❌ MISSING");

    if (!googleKey) {
        console.error("\n❌ CRITICAL: You need to add keys to your .env file!");
        return;
    }

    // --- DEBUGGING: Check Available Models ---
    console.log('\n--- 🔍 Checking Available Models (via API) ---');
    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${googleKey}`);
        if (!resp.ok) {
            console.error(`❌ ListModels Failed: ${resp.status} ${resp.statusText}`);
            const errText = await resp.text();
            console.error(`Reason: ${errText}`);
        } else {
            const data = await resp.json();
            // Filter only embedding models
            const embeddings = (data.models || []).filter((m: any) => m.name.includes('embedding'));
            console.log(`Found ${embeddings.length} embedding models:`);
            embeddings.forEach((m: any) => console.log(` - ${m.name} (${m.displayName})`));

            if (embeddings.length === 0) {
                console.warn("⚠️ WARNING: Your API Key has access to ZERO embedding models! Are you using a restricted key?");
            }
        }
    } catch (e) {
        console.error("❌ Failed to fetch models list:", e);
    }

    // --- PROCEED WITH TEST IF MODELS FOUND ---
    try {
        console.log('\n1. 🧠 Testing Google Embeddings...');
        const testText = 'Ladakh Luxury Package 6N/7D with Grand Dragon Hotel';
        const vector = await generateEmbedding(testText);
        console.log('   ✅ Vector Generated! Dimensions:', vector.length);

        console.log(`2. 🌲 Connecting to Pinecone Index: ${INDEX_NAME}...`);
        const index = pinecone.index(INDEX_NAME);

        console.log('3. 📤 Upserting Test Record...');
        await index.upsert([{
            id: 'test-package-01',
            values: vector,
            metadata: {
                text: testText,
                price: 45000,
                type: 'test'
            }
        }]);
        console.log('   ✅ Record Upserted.');

        // (Rest of script same as before)
        console.log('4. ⏳ Waiting 5s for indexing consistency...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('5. 🔍 Querying the same record...');
        const queryResponse = await index.query({
            vector: vector,
            topK: 1,
            includeMetadata: true,
        });

        if (queryResponse.matches.length > 0) {
            console.log('\n✅ SUCCESS: RAG System is Connected! 🚀');
        } else {
            console.error('\n❌ FAIL: No matches found.');
        }

    } catch (error: any) {
        console.error('\n❌ Verification Failed:', error);
        if (error && error.message) console.error('Error Message:', error.message);
        if (error && error.cause) console.error('Error Cause:', error.cause);
        if (error && error.response) {
            try {
                const text = await error.response.text();
                console.error('Error Response Body:', text);
            } catch (e) {
                console.error('Error reading response body', e);
            }
        }
    }
}

main();
