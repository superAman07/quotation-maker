'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssistantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export function AssistantPopup({ isOpen, onClose, onMinimize }: AssistantPopupProps) {
  const [input, setInput] = useState('');
  const { messages, status, sendMessage } = useChat();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const isLoading = status === 'submitted' || status === 'streaming';

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed bottom-28 right-8 z-50 flex h-150 w-96 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between rounded-t-2xl border-b bg-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3e482e]">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-700">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={onMinimize} className="h-8 w-8 text-gray-500 hover:bg-gray-200">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 hover:bg-gray-200">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="grow bg-gray-50 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3e482e] text-white shrink-0">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow-sm ${m.role === 'user' ? 'rounded-br-none bg-[#3e482e] text-white' : 'rounded-bl-none bg-white text-gray-800'}`}>
                    {m.parts.map((part, index) => {
                      if (part.type === 'text') {
                        return <p key={index} style={{ whiteSpace: 'pre-wrap' }}>{part.text}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t bg-white p-4">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="grow rounded-full border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#6C733D]"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="h-10 w-10 rounded-full bg-[#3e482e] p-0 text-white hover:bg-[#5a5f33] transition-colors disabled:bg-gray-300">
              {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}