'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ChatAssistant() {
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

  return (
    <Card className="w-full max-w-2xl text-gray-600 mb-10 mx-auto">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[600px]">
        <ScrollArea className="flex-grow mb-4 pr-4">
          <div className="space-y-4">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-md ${
                  m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {m.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return <p key={index} className="text-sm">{part.text}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about packages, hotels, etc..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? '...' : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
