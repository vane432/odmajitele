'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SuggestedPrompt {
  text: string;
  icon: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { text: 'Hledám rodinný dům v Brně pod 15M CZK', icon: '🏡' },
  { text: 'Luxusní auto s malým nájezdem', icon: '🚗' },
  { text: 'Kavárnu nebo restauraci v centru', icon: '☕' },
  { text: 'Investiční nemovitost do 10M', icon: '💼' },
  { text: 'Apartment in city center under 10 million', icon: '🏠' },
  { text: 'Reliable car for commuting under 1M CZK', icon: '🚙' },
];

export default function ChatInterface() {
  const { messages, sendMessage, status } = useChat({
    api: '/api/chat',
  });
  
  const [input, setInput] = useState('');
  const isLoading = status === 'in_progress';

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: 'user', content: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold">AI Asistent odmajitele.com</h2>
            <p className="text-sm text-blue-100">Najděte perfektní nabídku konverzací v češtině nebo angličtině</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vítejte! Jak vám mohu pomoci?
            </h3>
            <p className="text-gray-600 mb-6">
              Řekněte mi, co hledáte, a já najdu nejlepší nabídky pro vás.
            </p>
            
            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="flex items-center gap-3 p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all group"
                >
                  <span className="text-2xl">{prompt.icon}</span>
                  <span className="text-sm text-gray-700 group-hover:text-blue-700">
                    {prompt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold">AI Asistent</span>
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Hledám nejlepší nabídky...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
        <form onSubmit={onSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napište, co hledáte... (např. 'rodinný dům v Brně')"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Odeslat</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
