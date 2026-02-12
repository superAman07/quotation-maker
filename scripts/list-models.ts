import 'dotenv/config';

async function listModels() {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.API_KEY;
    if (!key) {
        console.error("❌ No API Key found");
        return;
    }

    console.log("🔍 Fetching available models...");
    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await resp.json();

        if (data.error) {
            console.error("❌ API Error:", data.error);
            return;
        }

        console.log("\n--- GENERATION MODELS ---");
        (data.models || [])
            .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
            .forEach((m: any) => console.log(`• ${m.name} (${m.displayName})`));

        console.log("\n--- EMBEDDING MODELS ---");
        (data.models || [])
            .filter((m: any) => m.supportedGenerationMethods?.includes("embedContent"))
            .forEach((m: any) => console.log(`• ${m.name} (${m.displayName})`));

    } catch (error) {
        console.error("❌ Failed to list models:", error);
    }
}

listModels();
