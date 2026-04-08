-- Phase 3A Step 2: Add Embedding Column to Listings Table
-- Run this AFTER enabling pgvector extension

-- Add embedding column (1536 dimensions for OpenAI text-embedding-3-small)
ALTER TABLE listings 
ADD COLUMN embedding vector(1536);

-- Create index for fast cosine similarity search
-- Note: This uses ivfflat indexing which is fast for large datasets
-- The lists parameter (100) can be adjusted based on dataset size
-- Rule of thumb: lists = rows / 1000 (for smaller datasets, 100 is fine)
CREATE INDEX listings_embedding_idx 
ON listings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'embedding';

-- Check the index was created
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'listings' AND indexname = 'listings_embedding_idx';
