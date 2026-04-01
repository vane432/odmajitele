# OdMajitele.com - Premium Czech Marketplace MVP

A curated, premium marketplace for high-ticket items (Real Estate, Cars, Businesses) sold directly by owners in Brno, Czech Republic.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Components**: Custom components with Shadcn UI patterns
- **Backend**: Supabase (PostgreSQL + Auth + Storage) - Ready for integration
- **Deployment**: Vercel-ready

## 🎨 Design System

### Brand Colors
- **Primary (Navy)**: `#0F172A` - Headers, text, footer
- **Accent (Amber)**: `#F59E0B` - CTA buttons, highlights
- **Background**: `#F8FAFC` - Page background
- **Cards**: `#FFFFFF` - White cards with soft shadows

### Typography
- **Font**: Inter (sans-serif)
- **Logo**: **Od**Majitele**.com** (bold + light + amber)

### Categories
- **Nemovitosti** (Real Estate) - Blue badge
- **Auta** (Cars) - Purple badge
- **Firmy** (Businesses) - Green badge

## 📂 Project Structure

```
odmajitele/
├── app/
│   ├── layout.tsx          # Global layout with navbar & footer
│   ├── page.tsx            # Homepage with hero, categories, listings
│   ├── globals.css         # Global styles & Tailwind imports
│   ├── listing/[id]/
│   │   └── page.tsx        # Dynamic listing detail page
│   └── admin/
│       └── page.tsx        # Admin dashboard for adding listings
├── lib/
│   ├── utils.ts            # Utility functions (cn helper)
│   ├── types.ts            # TypeScript types & category configs
│   └── mockData.ts         # Mock listings data (6 examples)
├── tailwind.config.ts      # Tailwind configuration
├── next.config.js          # Next.js config (with image domains)
└── package.json            # Dependencies
```

## 🎯 Features Implemented (MVP)

### ✅ Homepage
- Hero section with clear value proposition
- 3 clickable category cards (Nemovitosti, Auta, Firmy)
- Grid of 6 latest listings with images, prices, location
- Responsive design (mobile, tablet, desktop)

### ✅ Listing Detail Page
- Image gallery with thumbnail navigation
- Category badge and location
- Price display (formatted in CZK)
- Specifications grid (dynamic based on category)
- Full description
- Sticky contact form sidebar

### ✅ Contact Form
- Name, Email, Phone, Message fields
- Pre-filled message template
- Form validation
- Submit handler (logs to console in MVP)

### ✅ Admin Dashboard
- Manual listing creation form
- Category selection dropdown
- Price and location fields
- Dynamic feature/specification builder
- Image URL inputs (multiple)
- Form submission (logs to console in MVP)

### ✅ Navigation
- Sticky navbar with logo
- Category quick links
- "Přidat inzerát" CTA button
- Professional footer with links

## 🚦 Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. **Navigate to project directory**:
   ```bash
   cd /Users/danishazizi/Downloads/odmajitele
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📸 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, and latest listings |
| `/listing/[id]` | Dynamic listing detail page (e.g., `/listing/1`) |
| `/admin` | Admin dashboard for creating listings |
| `/?category=nemovitosti` | Filter by Real Estate (future feature) |
| `/?category=auta` | Filter by Cars (future feature) |
| `/?category=firmy` | Filter by Businesses (future feature) |

## 🎨 Mock Data

The MVP includes 6 sample listings:
- 2 Real Estate properties (apartments, houses)
- 2 Cars (BMW, Mercedes)
- 2 Businesses (e-shop, café)

All use high-quality Unsplash images and realistic Czech descriptions.

## 🔜 Phase 2: Supabase Integration

### Database Schema (Ready to implement)

```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('nemovitosti', 'auta', 'firmy')),
  price BIGINT NOT NULL,
  location TEXT DEFAULT 'Brno',
  description TEXT NOT NULL,
  features JSONB,
  image_urls TEXT[],
  owner_email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Integration Tasks
1. Set up Supabase project
2. Create `listings` table with schema above
3. Configure Supabase Storage for image uploads
4. Add Supabase client (`@supabase/supabase-js`)
5. Create API routes for:
   - `GET /api/listings` - Fetch all listings
   - `GET /api/listings/:id` - Fetch single listing
   - `POST /api/listings` - Create new listing
   - `POST /api/contact` - Send contact form email
6. Replace mock data with database queries
7. Add Supabase Auth for admin protection
8. Implement image upload to Supabase Storage

## 🎯 Design Philosophy

**"The Anti-Bazoš"** - This marketplace prioritizes:
- ✨ Premium feel over quantity
- 🔒 Trust signals (verified owners, quality photos)
- 🎨 Clean, uncluttered UI
- 💰 High-ticket transactions
- 🏙️ Local focus (Brno-first approach)

## 📱 Responsive Design

- **Mobile**: Single column, stacked layout
- **Tablet**: 2-column grids
- **Desktop**: 3-column grids, sticky sidebar

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy with one click

### Environment Variables (for Phase 2)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## 📝 Notes

- All UI text is in Czech language
- Prices formatted in CZK (Czech Koruna)
- Images currently from Unsplash (replace with Supabase Storage)
- Contact form logs to console (implement email service in Phase 2)
- Admin route is unprotected (add auth in Phase 2)

## 🤝 Contributing

This is a MVP project. Future enhancements:
- [ ] User authentication
- [ ] Search & filters
- [ ] Favorites/bookmarks
- [ ] Owner dashboard
- [ ] Email notifications
- [ ] Mobile app
- [ ] Payment integration

---

**Built with ❤️ for premium marketplace transactions in Brno**
