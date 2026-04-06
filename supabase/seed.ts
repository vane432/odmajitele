import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const mockListings = [
  {
    title: 'Luxusní byt 3+kk v centru Brna',
    category: 'nemovitosti',
    price: 8500000,
    location: 'Brno - Centrum',
    description: 'Nádherný prostorný byt ve vyhledávané lokalitě, kompletně zrekonstruovaný s moderním vybavením. Výborná dostupnost MHD, obchody a restaurace v okolí.',
    features: {
      'Plocha': '85 m²',
      'Počet pokojů': '3+kk',
      'Stav': 'Po rekonstrukci',
      'Parkování': 'Vlastní garážové stání',
    },
    image_urls: [
      'https://images.unsplash.com/photo-1502672260066-6bc176cf689d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    owner_email: 'vlastnik1@example.com',
  },
  {
    title: 'BMW X5 3.0d, rok 2021',
    category: 'auta',
    price: 1250000,
    location: 'Brno - Vinohrady',
    description: 'Perfektní stav, pravidelný servis BMW, nehavarované. Kompletní servisní historie. První majitel.',
    features: {
      'Rok výroby': '2021',
      'Nájezd': '45 000 km',
      'Palivo': 'Diesel',
      'Výkon': '210 kW',
    },
    image_urls: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617531653520-bd466d8f2b14?w=800&h=600&fit=crop',
    ],
    owner_email: 'vlastnik2@example.com',
  },
  {
    title: 'E-shop s módou - zavedený byznys',
    category: 'firmy',
    price: 3200000,
    location: 'Brno',
    description: 'Úspěšný e-shop se zaměřením na pánskou a dámskou módu. Stabilní zákaznická základna, propracovaný marketing.',
    features: {
      'Roční obrat': '8 500 000 Kč',
      'Zisk': '1 200 000 Kč/rok',
      'Počet zaměstnanců': '4',
      'Založeno': '2019',
    },
    image_urls: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    ],
    owner_email: 'vlastnik3@example.com',
  },
  {
    title: 'Rodinný dům 5+1, Brno-Bystrc',
    category: 'nemovitosti',
    price: 12500000,
    location: 'Brno - Bystrc',
    description: 'Prostorný rodinný dům v klidné části Brna s krásným výhledem. Velká zahrada, garáž pro 2 auta.',
    features: {
      'Plocha': '220 m²',
      'Pozemek': '800 m²',
      'Počet pokojů': '5+1',
      'Stav': 'Velmi dobrý',
    },
    image_urls: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ],
    owner_email: 'vlastnik4@example.com',
  },
  {
    title: 'Mercedes-Benz E220d, rok 2022',
    category: 'auta',
    price: 980000,
    location: 'Brno - Střed',
    description: 'Luxusní sedan v perfektním stavu. Plná výbava, kožené sedačky, panoramatická střecha.',
    features: {
      'Rok výroby': '2022',
      'Nájezd': '28 000 km',
      'Palivo': 'Diesel',
      'Výkon': '143 kW',
    },
    image_urls: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&h=600&fit=crop',
    ],
    owner_email: 'vlastnik5@example.com',
  },
  {
    title: 'Kavárna v centru Brna',
    category: 'firmy',
    price: 2800000,
    location: 'Brno - Centrum',
    description: 'Dobře zavedená kavárna s moderním vybavením a stálou klientelou. Výborná lokalita s velkým potenciálem.',
    features: {
      'Roční obrat': '4 200 000 Kč',
      'Zisk': '850 000 Kč/rok',
      'Počet míst': '35',
      'Založeno': '2018',
    },
    image_urls: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=600&fit=crop',
    ],
    owner_email: 'vlastnik6@example.com',
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  // Insert mock listings
  for (const listing of mockListings) {
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single();

    if (error) {
      console.error(`❌ Error inserting "${listing.title}":`, error.message);
    } else {
      console.log(`✅ Inserted: ${listing.title} (ID: ${data.id})`);
    }
  }

  console.log('\n✨ Database seeding complete!');
}

seedDatabase().catch(console.error);
