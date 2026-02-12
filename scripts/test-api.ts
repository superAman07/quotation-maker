(async () => {
    console.log("🚀 Testing /api/generate-quotation...");

    try {
        const response = await fetch('http://127.0.0.1:3000/api/generate-quotation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: "Plan a trip to Ladakh, 6 days, luxury.",
                history: []
            })
        });

        console.log(`Response Status: ${response.status}`);
        const contentType = response.headers.get('content-type');
        console.log(`Content-Type: ${contentType}`);

        if (!response.ok) {
            console.error(`❌ API Failed: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
            process.exit(1);
        }

        console.log("✅ API Status: 200 OK");
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                process.stdout.write(chunk);
            }
        }
        console.log("\n\n✅ Stream completed.");

    } catch (error) {
        console.error("❌ Request failed:", error);
    }
})();
