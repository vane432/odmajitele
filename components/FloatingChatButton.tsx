'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function FloatingChatButton() {
  return (
    <Link
      href="/chat"
      aria-label="Otevřít AI chat"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-white shadow-xl transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline font-semibold">AI Chat</span>
    </Link>
  );
}
