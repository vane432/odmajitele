import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jak prodat nemovitost od majitele v Brně',
  description: 'Praktický návod, jak prodat nemovitost od majitele v Brně: cena, inzerát, prohlídky a bezpečný převod.',
  alternates: { canonical: '/pruvodce/jak-prodat-nemovitost-od-majitele' },
};

export default function SellPropertyGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 prose prose-slate">
      <h1>Jak prodat nemovitost od majitele v Brně</h1>
      <p>
        Prodej <strong>nemovitosti od majitele</strong> může být rychlý a výhodný, pokud správně nastavíte cenu
        a připravíte kvalitní prezentaci.
      </p>
      <h2>1. Správné nacenění</h2>
      <p>Porovnejte podobné nabídky v okolí a zohledněte stav, lokalitu i dispozici.</p>
      <h2>2. Kvalitní inzerát a fotky</h2>
      <p>Dobré světlo, čistý interiér a jasný popis výrazně zvýší zájem kupujících.</p>
      <h2>3. Bezpečný právní proces</h2>
      <p>Rezervační smlouva, advokátní úschova a kontrola v katastru jsou základ.</p>
    </div>
  );
}
