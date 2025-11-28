'use client';

import NavBar from '@/components/NavBar';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* NavBar - includes both top nav (desktop) and bottom nav (mobile) */}
      <NavBar />

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
