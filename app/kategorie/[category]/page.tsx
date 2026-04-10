import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Category, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types';
import { formatPrice } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const validCategories: Category[] = ['nemovitosti', 'auta', 'firmy'];

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!validCategories.includes(category as Category)) {
    return { title: 'Kategorie nenalezena' };
  }

  const categoryLabel = CATEGORY_LABELS[category as Category];
  return {
    title: `${categoryLabel} od majitele v Brně`,
    description: `${categoryLabel} od majitele v Brně. Prohlédněte si aktuální inzeráty bez provize a kontaktujte majitele napřímo.`,
    alternates: { canonical: `/kategorie/${category}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!validCategories.includes(category as Category)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  const categoryKey = category as Category;
  const categoryLabel = CATEGORY_LABELS[categoryKey];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zpět na hlavní stránku
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{categoryLabel} od majitele</h1>
          <p className="text-slate-600">Aktuální inzeráty v kategorii {categoryLabel.toLowerCase()} v Brně.</p>
        </div>

        {!listings || listings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
            V této kategorii zatím nejsou žádné inzeráty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => {
              const imageSrc =
                listing.image_urls?.[0] ||
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80';
              return (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200"
                >
                  <div className="relative h-64 bg-slate-200 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={cn('px-3 py-1 rounded-full text-sm font-semibold shadow-md', CATEGORY_COLORS[categoryKey])}>
                        {categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-500 transition-colors line-clamp-2">
                      {listing.title}
                    </h2>
                    <div className="flex items-center text-slate-500 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location}
                    </div>
                    <div className="text-2xl font-extrabold text-amber-500">{formatPrice(listing.price)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
