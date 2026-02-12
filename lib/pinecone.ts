import { Pinecone } from '@pinecone-database/pinecone';

// Ensure PINECONE_API_KEY is allowed in your .env
if (!process.env.PINECONE_API_KEY) {
    console.warn('Warning: PINECONE_API_KEY is not defined. Vector search will fail.');
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
});

export const INDEX_NAME = 'travomine-quotes';
