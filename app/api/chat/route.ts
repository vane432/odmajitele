import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/openai';

export const maxDuration = 30;

type ListingMatch = {
  id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  description: string;
  features?: Record<string, string | number>;
  similarity?: number;
};

type ListingCategory = 'nemovitosti' | 'auta' | 'firmy';

function detectCategoryIntent(query: string): ListingCategory | null {
  const q = query.toLowerCase();

  const businessWords = [
    'firma',
    'firmu',
    'byznys',
    'business',
    'podnik',
    'kavarna',
    'kavárna',
    'restaurace',
    'e-shop',
    'eshop',
  ];
  if (businessWords.some((w) => q.includes(w))) return 'firmy';

  const carWords = ['auto', 'auta', 'vuz', 'vůz', 'car', 'bmw', 'mercedes', 'skoda', 'škoda'];
  if (carWords.some((w) => q.includes(w))) return 'auta';

  const propertyWords = ['byt', 'dum', 'dům', 'nemovitost', 'pozemek', 'apartment', 'house', 'flat'];
  if (propertyWords.some((w) => q.includes(w))) return 'nemovitosti';

  return null;
}

function extractKeywords(query: string) {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 6);
}

function formatListingsFallback(query: string, listings: ListingMatch[]) {
  if (!listings.length) {
    return `Nenašel jsem teď relevantní nabídky pro: "${query}". Zkuste prosím upřesnit lokalitu, rozpočet nebo kategorii.`;
  }

  const top = listings.slice(0, 3);
  const rows = top
    .map((listing, index) => {
      const similarity =
        typeof listing.similarity === 'number'
          ? ` (relevance ${(listing.similarity * 100).toFixed(1)}%)`
          : '';
      return `${index + 1}. ${listing.title}${similarity}
Cena: ${listing.price.toLocaleString('cs-CZ')} CZK
Lokalita: ${listing.location}
Otevřít: /listing/${listing.id}`;
    })
    .join('\n\n');

  return `Našel jsem pro vás tyto nabídky:\n\n${rows}\n\nKlikněte na odkaz "Otevřít" pro detail nabídky.`;
}

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
    const intentCategory = detectCategoryIntent(userQuery);

    console.log(`\n🔍 AI Search Query: "${userQuery}"\n`);
    const supabase = await createClient();

    let relevantListings: ListingMatch[] = [];

    // Step 1+2: Semantic search with embeddings; fallback to keyword search if OpenAI fails
    try {
      const queryEmbedding = await generateEmbedding(userQuery);
      const { data, error } = await supabase.rpc('match_listings', {
        query_embedding: queryEmbedding,
        match_threshold: 0.18,
        match_count: 5,
      });

      if (error) {
        console.error('Error searching listings:', error);
      } else {
        relevantListings = (data ?? []) as ListingMatch[];
      }
    } catch (embedErr) {
      console.error('Embedding failed, falling back to keyword search:', embedErr);
    }

    if (intentCategory) {
      relevantListings = relevantListings.filter((l) => l.category === intentCategory);
    }

    // Fallback also when semantic search returns no results
    if (!relevantListings.length) {
      const keywords = extractKeywords(userQuery);
      if (keywords.length) {
        const keywordOr = keywords
          .map((kw) => `title.ilike.%${kw}%,description.ilike.%${kw}%,location.ilike.%${kw}%`)
          .join(',');
        let query = supabase
          .from('listings')
          .select('id,title,category,price,location,description,features')
          .or(keywordOr);
        if (intentCategory) {
          query = query.eq('category', intentCategory);
        }
        const { data } = await query.order('created_at', { ascending: false }).limit(5);
        relevantListings = (data ?? []) as ListingMatch[];
      }
    }

    // Last-resort fallback so assistant never says "nothing" when listings exist
    if (!relevantListings.length) {
      let query = supabase
        .from('listings')
        .select('id,title,category,price,location,description,features');
      if (intentCategory) {
        query = query.eq('category', intentCategory);
      }
      const { data } = await query.order('created_at', { ascending: false }).limit(5);
      relevantListings = (data ?? []) as ListingMatch[];
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
        context += `   Link: /listing/${listing.id}\n`;
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
- U každé doporučené nabídky uveď i přímý odkaz ve formátu: /listing/{id}
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

    // Step 5: Generate stable LLM response; fallback to deterministic response if model fails
    try {
      const result = await generateText({
        model: openai('gpt-4o-mini'),
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
      });

      return new Response(result.text, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (llmErr) {
      console.error('LLM failed, returning fallback response:', llmErr);
      return new Response(formatListingsFallback(userQuery, relevantListings), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return new Response(
      'AI asistent je dočasně nedostupný. Zkuste to prosím za chvíli.',
      { status: 500 }
    );
  }
}
