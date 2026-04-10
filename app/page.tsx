import Link from "next/link";
import Image from "next/image";
import { Building2, Car, Store, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/mockData";
import { CATEGORY_LABELS, CATEGORY_COLORS, Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  // Fetch latest listings from Supabase
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);
  
  const latestListings = listings || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-slate-800 to-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 text-balance">
            Prémiový trh bez provize
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto text-balance">
            Kupujte a prodávejte nemovitosti, auta a firmy přímo od majitelů v Brně
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#category"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center"
            >
              Prohlédnout inzeráty
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/admin"
              className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl border-2 border-white inline-flex items-center justify-center"
            >
              Přidat inzerát
            </Link>
          </div>
        </div>
      </section>

      {/* AI Search Highlight */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-blue-100 font-semibold mb-2">
                  <Sparkles className="h-5 w-5" />
                  Hlavní novinka
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
                  AI asistent pro vyhledávání inzerátů
                </h2>
                <p className="text-blue-100 max-w-2xl">
                  Napište přirozeně, co hledáte, a AI vám doporučí nejlepší nabídky včetně přímých odkazů.
                </p>
              </div>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-lg bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 font-bold shadow-md"
              >
                Otevřít AI chat
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section id="category" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">
            Vyberte kategorii
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard
              title="Nemovitosti"
              description="Byty, domy a pozemky přímo od majitelů"
              icon={<Building2 className="h-12 w-12" />}
              href="/?category=nemovitosti"
              color="from-blue-500 to-blue-600"
            />
            <CategoryCard
              title="Auta"
              description="Prémiová vozidla ve výborném stavu"
              icon={<Car className="h-12 w-12" />}
              href="/?category=auta"
              color="from-purple-500 to-purple-600"
            />
            <CategoryCard
              title="Firmy"
              description="Zavedené byznysy a e-shopy"
              icon={<Store className="h-12 w-12" />}
              href="/?category=firmy"
              color="from-green-500 to-green-600"
            />
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900">
              Nejnovější inzeráty
            </h2>
            <Link
              href="/listings"
              className="text-amber-500 hover:text-amber-600 font-semibold flex items-center"
            >
              Zobrazit vše
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function CategoryCard({ title, description, icon, href, color }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 border-2 border-slate-100"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity", color)} />
      <div className="p-8 relative">
        <div className={cn("inline-flex p-4 rounded-xl bg-gradient-to-br text-white mb-4 shadow-lg", color)}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
        <div className="mt-4 flex items-center text-amber-500 font-semibold group-hover:translate-x-2 transition-transform">
          Procházet
          <ArrowRight className="ml-2 h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    category: 'nemovitosti' | 'auta' | 'firmy';
    price: number;
    location: string;
    image_urls: string[];
  };
}

function ListingCard({ listing }: ListingCardProps) {
  const imageSrc =
    listing.image_urls?.[0] ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80';
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200"
    >
      {/* Image */}
      <div className="relative h-64 bg-slate-200 overflow-hidden">
        <Image
          src={imageSrc}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn("px-3 py-1 rounded-full text-sm font-semibold shadow-md", CATEGORY_COLORS[listing.category])}>
            {CATEGORY_LABELS[listing.category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-500 transition-colors line-clamp-2">
          {listing.title}
        </h3>
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {listing.location}
        </div>
        <div className="text-2xl font-extrabold text-amber-500">
          {formatPrice(listing.price)}
        </div>
      </div>
    </Link>
  );
}
