# Database Setup Instructions

## 1. Apply the Schema

Go to your Supabase project dashboard:
1. Navigate to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run** to execute the schema

This will:
- Create the `listings` table
- Set up Row Level Security (RLS) policies
- Create indexes for performance
- Add triggers for automatic timestamp updates

## 2. Seed the Database (Optional)

After applying the schema, you can seed the database with mock data:

```bash
npx tsx supabase/seed.ts
```

This will insert 6 sample listings (2 per category) into your database.

## Schema Overview

### Table: `listings`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `title` | TEXT | Listing title |
| `category` | TEXT | Category: 'nemovitosti', 'auta', or 'firmy' |
| `price` | BIGINT | Price in CZK |
| `location` | TEXT | Location string |
| `description` | TEXT | Full description |
| `features` | JSONB | Key-value pairs of features |
| `image_urls` | TEXT[] | Array of image URLs |
| `owner_email` | TEXT | Owner's email address |
| `owner_id` | UUID | Reference to auth.users |
| `created_at` | TIMESTAMP | Auto-generated creation time |
| `updated_at` | TIMESTAMP | Auto-updated modification time |

### RLS Policies

- **Public Read**: Anyone can view listings
- **Authenticated Create**: Only authenticated users can create listings
- **Owner Update**: Users can only update their own listings
- **Owner Delete**: Users can only delete their own listings
