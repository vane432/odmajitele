export type Category = 'nemovitosti' | 'auta' | 'firmy';

export interface Listing {
  id: string;
  title: string;
  category: Category;
  price: number;
  location: string;
  description: string;
  features: Record<string, string>;
  image_urls: string[];
  owner_email: string;
  created_at: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  nemovitosti: 'Nemovitosti',
  auta: 'Auta',
  firmy: 'Firmy',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  nemovitosti: 'bg-blue-100 text-blue-800',
  auta: 'bg-purple-100 text-purple-800',
  firmy: 'bg-green-100 text-green-800',
};
