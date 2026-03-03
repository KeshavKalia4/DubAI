import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft } from "lucide-react";

const USERS = [
  { id: 1, name: "Jessica Smith", role: "Student Leader", avatar: "JS", status: "online", lastMessage: "Can we reschedule the meeting?", time: "2m ago" },
  { id: 2, name: "Prof. Anderson", role: "Faculty Advisor", avatar: "PA", status: "offline", lastMessage: "The room booking is confirmed.", time: "1h ago" },
  { id: 3, name: "Event Support", role: "Staff", avatar: "ES", status: "online", lastMessage: "Let me check the AV equipment.", time: "3h ago" },
  { id: 4, name: "Husky Union", role: "Admin", avatar: "HU", status: "offline", lastMessage: "Your event has been approved.", time: "1d ago" },
];

const MESSAGES = [
  { id: 1, senderId: 2, text: "Hi there, just wanted to confirm if you need the projector for the event on Friday?", time: "10:30 AM" },
  { id: 2, senderId: 0, text: "Yes, we will need the main projector and two microphones.", time: "10:32 AM" },
  { id: 3, senderId: 2, text: "Noted. I'll have the AV team set it up by 5:30 PM.", time: "10:35 AM" },
  { id: 4, senderId: 0, text: "Perfect, thank you Professor!", time: "10:36 AM" },
  { id: 5, senderId: 2, text: "The room booking is confirmed.", time: "10:40 AM" },
];

export function Messages() {
  const [selectedUser, setSelectedUser] = useState(USERS[1]);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar List */}
      <div className={`
        ${showSidebar ? 'flex' : 'hidden md:flex'} 
        w-full md:w-80 border-r border-gray-200 flex-col bg-gray-50
      `}>
        <div className="p-3 md:p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e83]/20"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {USERS.map((user) => (
            <div 
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setShowSidebar(false);
              }}
              className={`p-3 md:p-4 hover:bg-white cursor-pointer transition-colors border-b border-gray-100 ${selectedUser.id === user.id ? "bg-white border-l-4 border-l-[#4b2e83]" : "border-l-4 border-l-transparent"}`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#4b2e83]/10 text-[#4b2e83] flex items-center justify-center font-bold text-sm">
                    {user.avatar}
                  </div>
                  {user.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className={`text-sm font-semibold truncate ${selectedUser.id === user.id ? "text-[#4b2e83]" : "text-gray-900"}`}>{user.name}</h4>
                    <span className="text-[10px] text-gray-400 ml-2 flex-shrink-0">{user.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`
        ${!showSidebar ? 'flex' : 'hidden md:flex'} 
        flex-1 flex-col bg-white
      `}>
        {/* Chat Header */}
        <div className="h-14 md:h-16 border-b border-gray-200 flex items-center justify-between px-3 md:px-6 bg-white">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <button 
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-[#4b2e83]/10 text-[#4b2e83] flex items-center justify-center font-bold text-xs md:text-sm">
              {selectedUser.avatar}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{selectedUser.name}</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                {selectedUser.status === "online" ? "Online" : "Last seen recently"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-gray-400">
            <button className="p-1.5 md:p-2 hover:text-[#4b2e83] transition-colors"><Phone size={18} className="md:w-5 md:h-5" /></button>
            <button className="p-1.5 md:p-2 hover:text-[#4b2e83] transition-colors"><Video size={18} className="md:w-5 md:h-5" /></button>
            <button className="p-1.5 md:p-2 hover:text-[#4b2e83] transition-colors"><MoreVertical size={18} className="md:w-5 md:h-5" /></button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-gray-50/50">
          {MESSAGES.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === 0 ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[70%] px-3 md:px-4 py-2 md:py-3 rounded-2xl shadow-sm text-sm ${
                  msg.senderId === 0 
                    ? "bg-[#4b2e83] text-white rounded-br-none" 
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                }`}
              >
                <p className="text-xs md:text-sm">{msg.text}</p>
                <div className={`text-[10px] mt-1 text-right ${msg.senderId === 0 ? "text-white/70" : "text-gray-400"}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#4b2e83]/20 focus-within:border-[#4b2e83]/50 transition-all">
            <button className="p-1.5 md:p-2 text-gray-400 hover:text-[#4b2e83] hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <Paperclip size={18} className="md:w-5 md:h-5" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-sm px-1 md:px-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Send logic
                  setInput("");
                }
              }}
            />
            <button className="p-1.5 md:p-2 bg-[#4b2e83] text-white rounded-lg hover:bg-[#3b2366] transition-colors shadow-sm flex-shrink-0">
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}