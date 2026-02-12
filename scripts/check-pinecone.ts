import 'dotenv/config';
import { pinecone, INDEX_NAME } from '../lib/pinecone';

async function check() {
    console.log(`Checking index: ${INDEX_NAME}`);
    try {
        const description = await pinecone.describeIndex(INDEX_NAME);
        console.log('Index Description:', JSON.stringify(description, null, 2));
    } catch (error) {
        console.error('Error describing index:', error);
    }
}

check();
