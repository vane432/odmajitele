import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embedding vector for a given text using OpenAI's text-embedding-3-small model
 * @param text - Text to embed (max ~8000 tokens)
 * @returns Array of 1536 numbers representing the embedding
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Create a rich text representation of a listing for embedding
 * Combines all relevant fields into a searchable text
 */
export function createListingText(listing: {
  title: string;
  category: string;
  price: number;
  location: string;
  description: string;
  features?: Record<string, string | number>;
}): string {
  const categoryNames: Record<string, string> = {
    nemovitosti: 'Nemovitost / Real Estate / Property',
    auta: 'Auto / Car / Vehicle',
    firmy: 'Firma / Business / Company',
  };

  const categoryName = categoryNames[listing.category] || listing.category;
  
  // Format price with CZK
  const formattedPrice = `${listing.price.toLocaleString('cs-CZ')} CZK`;
  
  // Extract features as text
  const featuresText = listing.features
    ? Object.entries(listing.features)
        .map(([key, value]) => `${key}: ${value}`)
        .join('. ')
    : '';

  // Combine everything into rich searchable text
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
