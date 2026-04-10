import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Jak koupit auto od majitele: kontrolní checklist',
  description: 'Kupujete auto od majitele? Použijte checklist: historie vozu, technický stav, smlouva a převod.',
  alternates: { canonical: '/pruvodce/jak-koupit-auto-od-majitele' },
};

export default function BuyCarGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 prose prose-slate">
      <h1>Jak koupit auto od majitele: kontrolní checklist</h1>
      <p>
        Při nákupu <strong>auta od majitele</strong> je důležité prověřit historii, technický stav a právní čistotu vozidla.
      </p>
      <h2>Co zkontrolovat před koupí</h2>
      <ul>
        <li>VIN a servisní historie</li>
        <li>STK, emise a reálný nájezd</li>
        <li>Stav karoserie, motoru a interiéru</li>
      </ul>
      <h2>Dokumenty při převodu</h2>
      <ul>
        <li>Kupní smlouva s identifikací obou stran</li>
        <li>Malý a velký technický průkaz</li>
        <li>Potvrzení o evidenční kontrole</li>
      </ul>
      <p>
        Prohlédněte si také aktuální nabídky v sekci{' '}
        <Link href="/kategorie/auta">auta od majitele</Link>.
      </p>
    </div>
  );
}
