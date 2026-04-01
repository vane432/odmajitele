import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Building2, Car, Store } from "lucide-react";

export const metadata: Metadata = {
  title: "OdMajitele.com - Prémiový trh bez provize",
  description: "Kupujte a prodávejte nemovitosti, auta a firmy přímo od majitelů v Brně",
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
        <Footer />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">
              <span className="font-extrabold text-slate-900">Od</span>
              <span className="font-light text-slate-900">Majitele</span>
              <span className="text-amber-500 font-bold">.com</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/?category=nemovitosti"
              className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Building2 className="h-5 w-5" />
              <span className="font-medium">Nemovitosti</span>
            </Link>
            <Link
              href="/?category=auta"
              className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Car className="h-5 w-5" />
              <span className="font-medium">Auta</span>
            </Link>
            <Link
              href="/?category=firmy"
              className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Store className="h-5 w-5" />
              <span className="font-medium">Firmy</span>
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/admin"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Přidat inzerát
          </Link>
        </div>
      </div>
    </nav>
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
                <Link href="/?category=nemovitosti" className="hover:text-white transition-colors">
                  Nemovitosti
                </Link>
              </li>
              <li>
                <Link href="/?category=auta" className="hover:text-white transition-colors">
                  Auta
                </Link>
              </li>
              <li>
                <Link href="/?category=firmy" className="hover:text-white transition-colors">
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
