import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/listings/[id] - Fetch a single listing by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching listing:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listing' },
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

// PUT /api/listings/[id] - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Require authentication for updates
    if (!user) {
      return NextResponse.json(
        { error: 'Vyžadováno přihlášení' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, category, price, location, description, features, image_urls } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) {
      if (!['nemovitosti', 'auta', 'firmy'].includes(category)) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
      updateData.category = category;
    }
    if (price !== undefined) updateData.price = parseInt(price);
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = features;
    if (image_urls !== undefined) updateData.image_urls = image_urls;

    const { data, error } = await supabase
      .from('listings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating listing:', error);
      return NextResponse.json(
        { error: 'Failed to update listing' },
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

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Require authentication for deletes
    if (!user) {
      return NextResponse.json(
        { error: 'Vyžadováno přihlášení' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting listing:', error);
      return NextResponse.json(
        { error: 'Failed to delete listing' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
