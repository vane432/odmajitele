/**
 * Backfill embeddings for existing listings
 * 
 * This script fetches all listings without embeddings and generates them
 * Run with: npx tsx supabase/backfill-embeddings.ts
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiKey = process.env.OPENAI_API_KEY!;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error('❌ Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

function createListingText(listing: any): string {
  const categoryNames: Record<string, string> = {
    nemovitosti: 'Nemovitost / Real Estate / Property',
    auta: 'Auto / Car / Vehicle',
    firmy: 'Firma / Business / Company',
  };

  const categoryName = categoryNames[listing.category] || listing.category;
  const formattedPrice = `${listing.price.toLocaleString('cs-CZ')} CZK`;
  
  const featuresText = listing.features
    ? Object.entries(listing.features)
        .map(([key, value]: [string, any]) => `${key}: ${value}`)
        .join('. ')
    : '';

  const parts = [
    `Kategorie: ${categoryName}`,
    `Název: ${listing.title}`,
    `Cena: ${formattedPrice}`,
    `Lokace: ${listing.location}`,
    `Popis: ${listing.description}`,
  ];

  if (featuresText) {
    parts.push(`Vlastnosti: ${featuresText}`);
  }

  return parts.join('. ');
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  });

  return response.data[0].embedding;
}

async function backfillEmbeddings() {
  console.log('🚀 Starting embedding backfill...\n');

  // Fetch all listings without embeddings
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .is('embedding', null);

  if (error) {
    console.error('❌ Error fetching listings:', error);
    process.exit(1);
  }

  if (!listings || listings.length === 0) {
    console.log('✅ No listings need embeddings. All done!');
    return;
  }

  console.log(`📊 Found ${listings.length} listings without embeddings\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    console.log(`[${i + 1}/${listings.length}] Processing: ${listing.title}`);

    try {
      // Create rich text
      const listingText = createListingText(listing);
      console.log(`  📝 Text: ${listingText.substring(0, 100)}...`);

      // Generate embedding
      const embedding = await generateEmbedding(listingText);
      console.log(`  🧮 Embedding generated (${embedding.length} dimensions)`);

      // Update database
      const { error: updateError } = await supabase
        .from('listings')
        .update({ embedding })
        .eq('id', listing.id);

      if (updateError) {
        throw updateError;
      }

      successCount++;
      console.log(`  ✅ Stored successfully\n`);

      // Rate limiting: wait 100ms between requests to avoid hitting OpenAI limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      errorCount++;
      console.error(`  ❌ Error: ${err}\n`);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Backfill Complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Run the backfill
backfillEmbeddings().catch(console.error);
