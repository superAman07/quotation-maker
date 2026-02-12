import 'dotenv/config';
import { pinecone, INDEX_NAME } from '../lib/pinecone';
import { generateEmbedding } from '../lib/embeddings';

const SAMPLE_PACKAGES = [
  {
    id: 'pkg_ladakh_luxury',
    text: 'Ladakh Luxury Escape: 6 Nights 7 Days. Stay at Grand Dragon Ladakh. Visiting Leh, Nubra Valley, Pangong Lake. Includes dedicated Innova Crysta, all meals, oxygen cylinder, and inner line permits. Premium monastery tour included.',
    price: 45000,
    location: 'Ladakh',
    category: 'Luxury'
  },
  {
    id: 'pkg_kerala_honeymoon',
    text: 'Kerala Backwaters Honeymoon: 5 Nights 6 Days. Munnar, Thekkady, Alleppey Houseboat. Candlelight dinner in houseboat, flower decoration, private transfers. 4-star hotels inclusions.',
    price: 28000,
    location: 'Kerala',
    category: 'Honeymoon'
  },
  {
    id: 'pkg_bali_adventure',
    text: 'Bali Adventure Budget: 5 Nights 6 Days. Seminyak and Ubud. Includes Nusa Penida day tour, water sports (banana boat, jet ski), Uluwatu temple sunset. 3-star budget hotels with breakfast.',
    price: 35000,
    location: 'Bali',
    category: 'Adventure'
  }
];

async function seed() {
  console.log('🌱 Starting database seeding...');
  const index = pinecone.index(INDEX_NAME);

  for (const pkg of SAMPLE_PACKAGES) {
    console.log(`Processing: ${pkg.id}`);
    const vector = await generateEmbedding(pkg.text);
    
    await index.upsert([{
      id: pkg.id,
      values: vector,
      metadata: {
        text: pkg.text,
        price: pkg.price,
        location: pkg.location
      }
    }]);
  }

  console.log('✅ Seeding complete! Database is ready.');
}

seed();