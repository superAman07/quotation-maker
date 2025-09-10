'use client';

import { useState } from 'react';
import { AdminNavbar } from '@/components/admin-navbar';
import { FloatingAssistantButton } from '@/components/ai-setup/ai-botton';
import { AssistantPopup } from '@/components/ChatAssistant';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="pt-16">{children}</main>

      {/* AI Assistant Components */}
      {!isAssistantOpen && <FloatingAssistantButton onClick={() => setIsAssistantOpen(true)} />}
      <AssistantPopup 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)}
        onMinimize={() => setIsAssistantOpen(false)} 
      />
    </div>
  );
}