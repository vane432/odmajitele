/**
 * Test semantic search functionality
 * Run with: npx tsx supabase/test-search.ts
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function testSearch(query: string) {
  console.log(`\n🔍 Testing search for: "${query}"\n`);

  // Generate embedding for the search query
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    encoding_format: 'float',
  });

  const queryEmbedding = response.data[0].embedding;

  // Call the match_listings function
  const { data, error } = await supabase.rpc('match_listings', {
    query_embedding: queryEmbedding,
    match_threshold: 0.3, // Lower threshold to be more permissive
    match_count: 5,
  });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('❌ No results found');
    return;
  }

  console.log(`✅ Found ${data.length} relevant listings:\n`);
  
  data.forEach((listing: any, index: number) => {
    console.log(`${index + 1}. ${listing.title}`);
    console.log(`   Category: ${listing.category}`);
    console.log(`   Price: ${listing.price.toLocaleString('cs-CZ')} CZK`);
    console.log(`   Location: ${listing.location}`);
    console.log(`   Similarity: ${(listing.similarity * 100).toFixed(1)}%`);
    console.log('');
  });
}

async function runTests() {
  console.log('🧪 Testing Semantic Search\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Test 1: Czech query for family home
  await testSearch('Hledám rodinný dům v Brně pro velkou rodinu');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Test 2: English query for luxury car
  await testSearch('I need a luxury car with low mileage');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Test 3: Czech query for business
  await testSearch('Chci koupit kavárnu nebo restauraci v centru');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Test 4: English query for affordable apartment
  await testSearch('Apartment in city center under 10 million CZK');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

runTests().catch(console.error);
