import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Od Majitele Brno: Kompletní průvodce nákupem bez provize',
  description: 'Zjistěte, jak bezpečně kupovat od majitele v Brně. Praktické tipy pro nemovitosti, auta i firmy bez provize.',
  alternates: { canonical: '/pruvodce/od-majitele-brno' },
};

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 prose prose-slate">
      <h1>Od Majitele Brno: Jak nakupovat bezpečně a bez provize</h1>
      <p>
        Hledáte nabídky <strong>od majitele</strong> v Brně? Největší výhoda je přímý kontakt,
        rychlejší domluva a často i lepší cena bez prostředníka.
      </p>
      <h2>Proč kupovat od majitele</h2>
      <ul>
        <li>Nižší náklady bez provize realitce nebo zprostředkovateli</li>
        <li>Přímé informace od vlastníka</li>
        <li>Rychlejší vyjednávání podmínek</li>
      </ul>
      <h2>Na co si dát pozor</h2>
      <ul>
        <li>Vždy ověřte vlastnictví a dokumentaci</li>
        <li>Prověřte technický stav nemovitosti/auta/firmy</li>
        <li>Nikdy neposílejte zálohu bez smluvního rámce</li>
      </ul>
      <p>
        Chcete začít rovnou hledat? Vyzkoušejte náš <Link href="/chat">AI vyhledávač od majitele</Link>.
      </p>
    </div>
  );
}
