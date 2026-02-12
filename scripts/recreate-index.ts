import 'dotenv/config';
import { pinecone, INDEX_NAME } from '../lib/pinecone';

async function recreateIndex() {
    console.log(`🚀 Starting Index Recreation for: ${INDEX_NAME}`);

    try {
        // 1. Check if index exists
        console.log('1. 🔍 Checking existing indexes...');
        const existingIndexes = await pinecone.listIndexes();
        const indexExists = existingIndexes.indexes?.some(index => index.name === INDEX_NAME);

        if (indexExists) {
            console.log(`   ⚠️ Index "${INDEX_NAME}" found. Deleting... (This may take a moment)`);
            await pinecone.deleteIndex(INDEX_NAME);
            console.log('   ✅ Index deleted.');

            // Wait a bit to ensure deletion processes
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
            console.log('   ℹ️ Index does not exist. Skipping deletion.');
        }

        // 2. Create new index
        console.log('2. 🆕 Creating new index with dimension: 3072...');
        await pinecone.createIndex({
            name: INDEX_NAME,
            dimension: 3072, // Updated to match gemini-embedding-001 output
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });

        console.log('   ✅ Index creation request sent.');

        // 3. Wait for readiness (optional but good for verification)
        console.log('3. ⏳ Waiting for index to initialize...');
        // Simple wait loop or just finish (init setup typically fast for serverless)
        await new Promise(resolve => setTimeout(resolve, 10000));

        const description = await pinecone.describeIndex(INDEX_NAME);
        console.log('\n✅ DONE! Index Details:', JSON.stringify(description, null, 2));

    } catch (error) {
        console.error('\n❌ Failed to recreate index:', error);
    }
}

recreateIndex();
