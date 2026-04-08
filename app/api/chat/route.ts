import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/openai';

export const maxDuration = 30;

/**
 * POST /api/chat
 * Conversational AI search endpoint with RAG (Retrieval-Augmented Generation)
 * 
 * Body: { messages: Array<{ role: string, content: string }> }
 * Returns: Streaming text response with listing recommendations
 */
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response('Missing messages', { status: 400 });
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    console.log(`\n🔍 AI Search Query: "${userQuery}"\n`);

    // Step 1: Generate embedding for the user's query
    const queryEmbedding = await generateEmbedding(userQuery);

    // Step 2: Search for similar listings using pgvector
    const supabase = await createClient();
    const { data: relevantListings, error } = await supabase.rpc('match_listings', {
      query_embedding: queryEmbedding,
      match_threshold: 0.3, // 30% similarity threshold
      match_count: 5, // Top 5 most relevant
    });

    if (error) {
      console.error('Error searching listings:', error);
    }

    console.log(`✅ Found ${relevantListings?.length || 0} relevant listings\n`);

    // Step 3: Format the context for the LLM
    let context = '';
    if (relevantListings && relevantListings.length > 0) {
      context = 'DOSTUPNÉ NABÍDKY / AVAILABLE LISTINGS:\n\n';
      
      relevantListings.forEach((listing: any, index: number) => {
        const features = listing.features 
          ? Object.entries(listing.features)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
          : '';

        context += `${index + 1}. ${listing.title}\n`;
        context += `   ID: ${listing.id}\n`;
        context += `   Kategorie: ${listing.category}\n`;
        context += `   Cena: ${listing.price.toLocaleString('cs-CZ')} CZK\n`;
        context += `   Lokace: ${listing.location}\n`;
        context += `   Popis: ${listing.description}\n`;
        if (features) {
          context += `   Vlastnosti: ${features}\n`;
        }
        context += `   Relevance: ${(listing.similarity * 100).toFixed(1)}%\n\n`;
      });
    } else {
      context = 'Bohužel jsem nenašel žádné relevantní nabídky pro váš dotaz.\n';
      context += 'Unfortunately, I did not find any relevant listings for your query.\n';
    }

    // Step 4: Create the system prompt with guardrails
    const systemPrompt = `Jsi odborný makléř a asistent pro odmajitele.com, prémiový portál pro high-ticket položky v Brně (nemovitosti, auta, firmy).

ROLE:
- Pomáháš kupcům najít perfektní nabídku na základě jejich potřeb
- Komunikuješ profesionálně, přátelsky a upřímně
- Odpovídáš v jazyce, kterým se na tebe uživatel ptá (čeština nebo angličtina)

PRAVIDLA:
- VŽDY cituj konkrétní nabídky z kontextu níže (používej ID a název)
- Pokud uživatel hledá něco, co není v nabídkách, upřímně to řekni
- Doporuč max 2-3 nejrelevantnější nabídky, ne všechny
- Shrň klíčové výhody každé nabídky
- Pokud se uživatel ptá na témata mimo marketplace (politika, zdraví, atd.), slušně odmítni a přesměruj ho zpět k nabídkám
- Nikdy nevymýšlej nebo neupravuj ceny, vlastnosti nebo detaily - používej pouze informace z kontextu
- Na konci odpovědi navrhni, že uživatel může kliknout na nabídku pro více detailů

FORMAT ODPOVĚDI:
1. Krátké potvrzení dotazu
2. 2-3 konkrétní doporučení s ID, názvem a důvodem
3. Stručný závěr a call-to-action

${context}

PŘÍKLAD ODPOVĚDI:
"Na základě vašeho dotazu jsem našel 2 skvělé možnosti:

1. **Rodinný dům 5+1, Brno-Bystrc** (ID: xxx)
   Cena: 12,500,000 CZK
   → Ideální pro velkou rodinu, 5 pokojů, zahrada 800m², klidná lokalita

2. **Luxusní byt 3+kk v centru Brna** (ID: xxx)  
   Cena: 8,500,000 CZK
   → Perfektní lokace v centru, moderní, nižší cena

Chcete se podívat na některou z těchto nabídek podrobněji?"`;

    // Step 5: Stream the LLM response
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
