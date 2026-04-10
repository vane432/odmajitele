import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Navbar } from '@/components/Navbar';
import { FloatingChatButton } from '@/components/FloatingChatButton';

export const metadata: Metadata = {
  metadataBase: new URL("https://odmajitele.com"),
  title: {
    default: "Od Majitele | OdMajitele.com",
    template: "%s | OdMajitele.com",
  },
  description:
    "Od Majitele: Kupujte a prodávejte nemovitosti, auta a firmy přímo od majitelů v Brně. Bez realitky, bez provize.",
  keywords: [
    "od majitele",
    "od majitele brno",
    "nemovitosti od majitele",
    "auta od majitele",
    "firmy na prodej od majitele",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Od Majitele | OdMajitele.com",
    description:
      "Kupujte a prodávejte přímo od majitelů v Brně. Nemovitosti, auta a firmy bez provize.",
    url: "https://odmajitele.com",
    siteName: "OdMajitele.com",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Od Majitele | OdMajitele.com",
    description:
      "Nemovitosti, auta a firmy od majitele v Brně. Bez realitky a bez provize.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <FloatingChatButton />
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="text-2xl mb-4">
              <span className="font-extrabold">Od</span>
              <span className="font-light">Majitele</span>
              <span className="text-amber-500 font-bold">.com</span>
            </div>
            <p className="text-slate-400 text-sm">
              Prémiový trh pro vysokou hodnotu transakce v Brně.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Kategorie</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/kategorie/nemovitosti" className="hover:text-white transition-colors">
                  Nemovitosti
                </Link>
              </li>
              <li>
                <Link href="/kategorie/auta" className="hover:text-white transition-colors">
                  Auta
                </Link>
              </li>
              <li>
                <Link href="/kategorie/firmy" className="hover:text-white transition-colors">
                  Firmy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Informace</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/vop" className="hover:text-white transition-colors">
                  Všeobecné obchodní podmínky
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} OdMajitele.com. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </footer>
  );
}
