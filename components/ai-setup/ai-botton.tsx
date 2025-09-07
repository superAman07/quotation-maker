'use client';

import { Sparkles } from 'lucide-react';

interface FloatingAssistantButtonProps {
  onClick: () => void;
}

export function FloatingAssistantButton({ onClick }: FloatingAssistantButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl transition-transform duration-300 ease-in-out hover:scale-110 animate-pulse"
      aria-label="Open AI Assistant"
    >
      <Sparkles className="h-8 w-8" />
    </button>
  );
}