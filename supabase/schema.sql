-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('nemovitosti', 'auta', 'firmy')),
  price BIGINT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  owner_email TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.listings;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON public.listings(owner_id);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view listings
CREATE POLICY "Public listings are viewable by everyone"
  ON public.listings
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can create listings
CREATE POLICY "Authenticated users can create listings"
  ON public.listings
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update their own listings
CREATE POLICY "Users can update their own listings"
  ON public.listings
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can delete their own listings
CREATE POLICY "Users can delete their own listings"
  ON public.listings
  FOR DELETE
  USING (auth.uid() = owner_id);
