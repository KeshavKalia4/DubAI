import ChatInterface from '@/app/components/student/ChatInterface';

export function StudentChat() {
  return (
    <div className="h-full flex flex-col bg-[#08060f]">
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
