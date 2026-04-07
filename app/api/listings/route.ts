import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/listings - Fetch all listings with optional category filter
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by category if provided
    if (category && ['nemovitosti', 'auta', 'firmy'].includes(category)) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Require authentication for creating listings
    if (!user) {
      return NextResponse.json(
        { error: 'Vyžadováno přihlášení' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, category, price, location, description, features, image_urls, owner_email } = body;

    // Validate required fields
    if (!title || !category || !price || !location || !description || !owner_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['nemovitosti', 'auta', 'firmy'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const listingData: any = {
      title,
      category,
      price: parseInt(price),
      location,
      description,
      features: features || {},
      image_urls: image_urls || [],
      owner_email,
      owner_id: user.id,
    };

    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select()
      .single();

    if (error) {
      console.error('Error creating listing:', error);
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
