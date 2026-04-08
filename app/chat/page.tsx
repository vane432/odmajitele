import ChatInterface from '@/components/ChatInterface';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Home Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zpět na hlavní stránku</span>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🤖 AI Vyhledávač odmajitele.com
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Místo procházení desítek stránek jednoduše řekněte, co hledáte. 
            Náš AI asistent najde nejlepší nabídky na základě vašich potřeb.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              ✨ Jak to funguje?
            </h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Napište v češtině nebo angličtině, co přesně hledáte (např. &ldquo;rodinný dům v Brně s velkou zahradou&rdquo;)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>AI asistent analyzuje všechny dostupné nabídky a najde ty nejrelevantnější</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Dostanete personalizovaná doporučení s detaily a možností zobrazit celou nabídku</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
