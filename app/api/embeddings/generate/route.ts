import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmbedding, createListingText } from '@/lib/openai';

/**
 * POST /api/embeddings/generate
 * Generate and store embedding for a listing
 * 
 * Body: { listingId: string }
 * Returns: { success: boolean, embedding?: number[] }
 */
export async function POST(req: NextRequest) {
  try {
    const { listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing listingId' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch the listing
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (fetchError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Create rich text representation
    const listingText = createListingText({
      title: listing.title,
      category: listing.category,
      price: listing.price,
      location: listing.location,
      description: listing.description,
      features: listing.features,
    });

    console.log(`Generating embedding for listing: ${listing.title}`);
    console.log(`Text to embed: ${listingText.substring(0, 200)}...`);

    // Generate embedding
    const embedding = await generateEmbedding(listingText);

    // Store embedding in database
    const { error: updateError } = await supabase
      .from('listings')
      .update({ embedding })
      .eq('id', listingId);

    if (updateError) {
      console.error('Error updating embedding:', updateError);
      return NextResponse.json(
        { error: 'Failed to store embedding' },
        { status: 500 }
      );
    }

    console.log(`✅ Embedding generated and stored for listing: ${listing.title}`);

    return NextResponse.json({
      success: true,
      embedding,
      listingText,
    });
  } catch (error) {
    console.error('Error in /api/embeddings/generate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
