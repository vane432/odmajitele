-- Phase 3A Step 3: Create Similarity Search Function
-- Run this AFTER adding the embedding column

-- Create function to find similar listings based on query embedding
CREATE OR REPLACE FUNCTION match_listings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  category text,
  price bigint,
  location text,
  description text,
  features jsonb,
  image_urls text[],
  owner_email text,
  owner_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    listings.id,
    listings.title,
    listings.category,
    listings.price,
    listings.location,
    listings.description,
    listings.features,
    listings.image_urls,
    listings.owner_email,
    listings.owner_id,
    listings.created_at,
    listings.updated_at,
    1 - (listings.embedding <=> query_embedding) as similarity
  FROM listings
  WHERE 
    listings.embedding IS NOT NULL
    AND 1 - (listings.embedding <=> query_embedding) > match_threshold
  ORDER BY listings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Test the function with a dummy vector (all zeros)
-- This should return empty results or low similarity scores
SELECT id, title, similarity 
FROM match_listings(
  array_fill(0, ARRAY[1536])::vector,
  0.0,
  3
);

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION match_listings(vector(1536), float, int) TO authenticated;
GRANT EXECUTE ON FUNCTION match_listings(vector(1536), float, int) TO anon;
