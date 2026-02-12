'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { AppStatus, ChatMessage, TravelQuotation } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { QuotationPDF } from '@/components/Quotation-pdf';

// Dynamically import PDFDownloadLink to avoid server-side rendering issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span>Loading PDF...</span> }
);

const QuotationAIGenerator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [quotation, setQuotation] = useState<TravelQuotation | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const handleSend = async () => {
    if (!inputValue.trim() || status !== AppStatus.IDLE) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setStatus(AppStatus.READING);

    try {
      const history = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      setStatus(AppStatus.THINKING);

      const response = await fetch('/api/generate-quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      // Update Chat
      if (data.chatResponse) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.chatResponse },
        ]);
      }

      // Update PDF Data
      if (data.pdfData) {
        console.log("PDF Data Received:", data.pdfData);
        setQuotation(data.pdfData);
        setStatus(AppStatus.IDLE);
      } else {
        setStatus(AppStatus.IDLE);
      }

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error generating the quotation.' },
      ]);
      setStatus(AppStatus.IDLE);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50">
      {/* Sidebar: Chat Interface */}
      <div className="w-full md:w-1/2 flex flex-col border-r border-slate-200 bg-white">
        <header className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <h1 className="font-semibold text-lg tracking-tight">Travomine Assistant</h1>
          </div>
          {status !== AppStatus.IDLE && (
             <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium animate-pulse">
               <span className="w-2 h-2 bg-blue-500 rounded-full" />
               {status}
             </div>
           )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
              <div className="p-4 bg-slate-50 rounded-full text-3xl">✈️</div>
              <div>
                <p className="text-lg font-medium">Ready to create a quotation?</p>
                <p className="text-sm">Try: "Plan a trip to Ladakh for 6 days"</p>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                m.role === 'user' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </main>

        <footer className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              placeholder="Type your trip details (e.g., location, days, budget)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={status !== AppStatus.IDLE}
            />
            <button
              onClick={handleSend}
              disabled={status !== AppStatus.IDLE || !inputValue.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {status === AppStatus.IDLE ? 'Send' : <Loader2 className="animate-spin w-4 h-4" />}
            </button>
          </div>
        </footer>
      </div>

      {/* Preview Section */}
      <div className="w-full md:w-1/2 flex flex-col bg-slate-100 overflow-hidden relative">
        <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="font-semibold text-slate-700">Quotation Preview</h2>
          {quotation && (
            <PDFDownloadLink
              document={<QuotationPDF payload={quotation} />}
              fileName={`Quotation-${quotation.quotationNo || 'draft'}.pdf`}
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-all flex items-center gap-2"
            >
              {({ loading }) => (loading ? 'Generating PDF...' : '⬇ Download PDF')}
            </PDFDownloadLink>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          {quotation ? (
             <div className="text-center space-y-4">
                <div className="text-6xl">📄</div>
                <h3 className="text-xl font-bold text-slate-800">Quotation Ready!</h3>
                <p className="text-slate-500">Your quotation for <strong>{quotation.place}</strong> has been generated.</p>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 text-left text-sm space-y-2 inline-block">
                    <p><strong>Trip:</strong> {quotation.place}</p>
                    <p><strong>Duration:</strong> {quotation.totalNights} Nights</p>
                    <p><strong>Cost:</strong> ₹{quotation.totalGroupCost?.toLocaleString() ?? 0} Total</p>
                </div>
                <p className="text-sm text-slate-400 mt-4">Click the download button above to get the PDF.</p>
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
              <div className="w-16 h-16 border-4 border-dashed border-slate-200 rounded-full flex items-center justify-center">
                <span className="text-2xl opacity-30">📋</span>
              </div>
              <p className="text-sm">Quotation preview will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationAIGenerator;