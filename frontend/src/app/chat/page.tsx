'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-[#1a0f2e] via-[#0f0a1a] to-[#1e1528]">
      {/* NavBar - includes both top nav (desktop) and bottom nav (mobile) */}
      <NavBar
        showMenuButton={true}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </div>
  );
}
