'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/lib/chatService';
import { Sparkles, User, X } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface Conversation {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

export default function ChatInterface({ isSidebarOpen, setIsSidebarOpen }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // TODO: Wire up setConversations for adding/managing chat history
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'UW Events This Week',
            lastMessage: 'What events are happening this week?',
            timestamp: new Date('2024-01-15'),
        },
        {
            id: '2',
            title: 'Campus Dining Options',
            lastMessage: 'Where can I find good food on campus?',
            timestamp: new Date('2024-01-14'),
        },
        {
            id: '3',
            title: 'Library Hours',
            lastMessage: 'What are the library hours?',
            timestamp: new Date('2024-01-13'),
        },
    ]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleNewChat = () => {
        setMessages([]);
        setCurrentConversationId(null);
        setInput('');
        setIsSidebarOpen(false);
    };

    const handleSelectConversation = (conversationId: string) => {
        setCurrentConversationId(conversationId);
        // In a real app, you'd load the messages for this conversation
        setMessages([]);
        setIsSidebarOpen(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true); // Start Loading

        //Call the service
        try {
            const aiResponse = await sendChatMessage(userMessage.content);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse.response,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error', error);
        } finally {
            setIsLoading(false); // Stop Loading
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="flex h-full bg-linear-to-br from-[#1a0f2e] via-[#0f0a1a] to-[#1e1528] relative">
            {/* Mobile Overlay - click to close sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop permanent, Mobile drawer - UW Themed */}
            <div
                className={`
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                    fixed lg:relative
                    top-0 left-0
                    w-80 lg:w-72
                    max-w-[85vw]
                    h-full
                    shrink-0
                    border-r border-[#362955]
                    flex flex-col
                    z-50
                    transition-transform duration-300 ease-in-out
                    shadow-2xl lg:shadow-none
                    bg-[#1a0f2e]/95
                    backdrop-blur-md
                `}
            >
                {/* Close Button - Mobile Only */}
                <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-[#362955]">
                    <span className="text-lg font-bold bg-linear-to-r from-[#8268bc] to-[#9982d0] bg-clip-text text-transparent">
                        Chat History
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="h-8 w-8 rounded-lg hover:bg-[#362955] transition-all flex items-center justify-center"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5 text-[#8268bc]" strokeWidth={2} />
                    </button>
                </div>

                {/* New Chat Button - Enhanced UW Styled */}
                <div className="px-2 py-3">
                    <button
                        onClick={handleNewChat}
                        className="group/btn relative flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                    >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-linear-to-r from-[#4B2E83] via-[#5d3a9b] to-[#6b4ea8] animate-gradient-shift"></div>

                        {/* Glow effect layer */}
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-linear-to-r from-[#6b4ea8] via-[#8268bc] to-[#9982d0] blur-xl"></div>
                        </div>

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-30 transition-opacity duration-500">
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white to-transparent skew-x-12"></div>
                        </div>

                        {/* Border gradient */}
                        <div className="absolute inset-0 rounded-xl p-[2px] bg-linear-to-r from-[#5d3a9b] via-[#4B2E83] to-[#6b4ea8] opacity-50 group-hover/btn:opacity-100 transition-opacity"></div>
                        <div className="absolute inset-[2px] rounded-[10px] bg-linear-to-r from-[#4B2E83] via-[#5d3a9b] to-[#6b4ea8] animate-gradient-shift"></div>

                        {/* Content */}
                        <div className="relative flex items-center gap-3 z-10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="h-5 w-5 group-hover/btn:rotate-90 transition-transform duration-300"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            <span className="font-bold tracking-wide">New Chat</span>
                        </div>
                    </button>
                </div>

                {/* Conversations List - Scrollable */}
                <div className="flex-1 overflow-y-auto px-2">
                    <div className="space-y-2">
                        {conversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => handleSelectConversation(conversation.id)}
                                className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all ${currentConversationId === conversation.id
                                    ? 'bg-linear-to-br from-[#4B2E83]/60 to-[#5d3a9b]/40 shadow-lg shadow-[#8268bc]/20 border-2 border-[#8268bc]/50'
                                    : 'hover:bg-[#2a1f47]/50 border-2 border-transparent hover:border-[#8268bc]/20'
                                    }`}
                            >
                                <div className="truncate font-semibold text-[#f5f5f5]">
                                    {conversation.title}
                                </div>
                                <div className="mt-1.5 flex items-center justify-between text-xs text-[#a3a3a3]">
                                    <span className="truncate">{conversation.lastMessage}</span>
                                    <span className="ml-2 shrink-0 font-medium">{formatDate(conversation.timestamp)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area - Modern AI Chat Design */}
            <div className={`flex flex-1 flex-col min-w-0 ${isSidebarOpen ? 'hidden lg:flex' : ''}`}>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                    <div className="mx-auto max-w-4xl">
                        {messages.length === 0 && (
                            <div className="flex h-full items-center justify-center px-4 py-12">
                                <div className="text-center relative max-w-2xl">
                                    {/* Animated gradient orbs */}
                                    <div className="absolute -top-20 left-1/4 w-32 h-32 bg-linear-to-br from-[#4B2E83]/20 to-[#B7A57A]/20 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="absolute -top-16 right-1/4 w-40 h-40 bg-linear-to-br from-[#B7A57A]/15 to-[#4B2E83]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

                                    <div className="relative">
                                        {/* AI Icon */}
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-[#4B2E83] to-[#5d3a9b] shadow-2xl shadow-[#4B2E83]/30 mb-6 animate-float">
                                            <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
                                        </div>

                                        <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-[#4B2E83] via-[#5d3a9b] to-[#B7A57A] bg-clip-text text-transparent mb-4">
                                            DubAI
                                        </h2>

                                        <p className="text-base sm:text-lg text-[#d4d4d4] mb-8 leading-relaxed">
                                            Your intelligent UW companion for events, activities, and campus life
                                        </p>

                                        {/* Suggested prompts */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                                            {['What events are happening this week?', 'Tell me about clubs on campus', 'When is the next career fair?', 'Study spots near me'].map((prompt, i) => (
                                                <button
                                                    key={i}
                                                    className="px-4 py-3 rounded-xl bg-[#1e1432]/80 border border-[#362955] hover:border-[#8268bc] hover:shadow-lg transition-all duration-200 text-sm text-[#d4d4d4] hover:text-[#8268bc] text-left group"
                                                    onClick={() => setInput(prompt)}
                                                >
                                                    <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">{prompt}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 sm:gap-4 items-start animate-fade-in ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${
                                        message.role === 'user'
                                            ? 'bg-linear-to-br from-[#8268bc] to-[#9982d0] text-white'
                                            : 'bg-linear-to-br from-[#B7A57A] to-[#d4c79f] text-white'
                                    }`}>
                                        {message.role === 'user' ? (
                                            <User className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                        ) : (
                                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex-1 max-w-[calc(100%-3rem)] sm:max-w-[calc(100%-4rem)] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className={`group relative px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${
                                            message.role === 'user'
                                                ? 'bg-linear-to-br from-[#8268bc] to-[#9982d0] text-white rounded-tr-md'
                                                : 'bg-[#1e1432] text-[#f5f5f5] border border-[#362955]/50 rounded-tl-md backdrop-blur-sm'
                                        }`}>
                                            {/* Message text */}
                                            <p className="whitespace-pre-wrap wrap-break-word text-sm sm:text-base leading-relaxed">
                                                {message.content}
                                            </p>

                                            {/* Hover glow effect */}
                                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl ${
                                                message.role === 'user'
                                                    ? 'bg-[#8268bc]/40'
                                                    : 'bg-[#d4c79f]/30'
                                            }`}></div>
                                        </div>

                                        {/* Timestamp */}
                                        <span className="text-xs text-[#6b7280] mt-1 px-2">
                                            {new Date(parseInt(message.id)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area - UW Themed */}
                <div className="border-t border-[#362955] bg-[#1a0f2e]/90 backdrop-blur-md safe-area-bottom">
                    <div className="mx-auto max-w-3xl px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-end gap-2 sm:gap-3 rounded-2xl border-2 border-[#362955] bg-[#1e1432] p-2.5 sm:p-3 shadow-lg transition-all focus-within:shadow-xl hover:border-[#8268bc]/50">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Message DubAI..."
                                rows={1}
                                className="max-h-32 flex-1 resize-none border-none bg-transparent px-2 py-2 text-sm sm:text-base text-[#f5f5f5] placeholder-[#a3a3a3] outline-none! focus:outline-none! focus-visible:outline-none!"
                                style={{ outline: 'none !important', boxShadow: 'none !important' }}
                            />
                            <button
                               onClick={handleSend}
                               disabled={!input.trim() || isLoading}
                               className="rounded-xl bg-linear-to-r from-[#8268bc] to-[#9982d0] hover:from-[#9982d0] hover:to-[#a896e0] p-3 text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:from-[#737373] disabled:to-[#737373]"
                               aria-label="Send message"
                            >
                                {isLoading ? (
                                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

