-- Phase 3A Step 1: Enable pgvector Extension
-- Run this in Supabase SQL Editor

-- Enable the vector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify the extension is enabled
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Test vector operations (should return a result if successful)
SELECT '[1,2,3]'::vector;
