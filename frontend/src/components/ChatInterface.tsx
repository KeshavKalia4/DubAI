'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/lib/chatService';
import { Menu, X } from 'lucide-react';

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

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="flex h-full bg-white dark:bg-gray-900 relative">
            {/* Mobile Overlay - solid background to completely hide content behind sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-white dark:bg-gray-900 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop permanent, Mobile drawer */}
            <div
                className={`
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                    fixed lg:relative
                    top-0 left-0
                    w-full sm:w-80 lg:w-72
                    max-w-none
                    h-full
                    shrink-0
                    border-r border-gray-200 dark:border-gray-700
                    flex flex-col
                    z-50
                    transition-transform duration-300 ease-in-out
                    shadow-2xl lg:shadow-none
                    bg-gray-50 dark:bg-gray-900
                `}
            >
                {/* Spacer to account for NavBar height on mobile */}
                <div className="lg:hidden h-[60px] shrink-0"></div>

                {/* Hamburger Button - Mobile Only (closes sidebar) */}
                <div className="lg:hidden px-3 pt-3">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="px-3 py-3">
                    <button
                        onClick={handleNewChat}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                        New Chat
                    </button>
                </div>

                {/* Conversations List - Scrollable */}
                <div className="flex-1 overflow-y-auto px-2">
                    <div className="space-y-1">
                        {conversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => handleSelectConversation(conversation.id)}
                                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all ${currentConversationId === conversation.id
                                    ? 'bg-gray-200 dark:bg-gray-700 shadow-sm'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="truncate font-medium text-gray-900 dark:text-gray-100">
                                    {conversation.title}
                                </div>
                                <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span className="truncate">{conversation.lastMessage}</span>
                                    <span className="ml-2 shrink-0">{formatDate(conversation.timestamp)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex flex-1 flex-col min-w-0 ${isSidebarOpen ? 'hidden lg:flex' : ''}`}>
                {/* Mobile Header with Menu Button Only - No border */}
                {!isSidebarOpen && (
                    <div className="lg:hidden flex items-center p-4 bg-white dark:bg-gray-900">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Open sidebar"
                        >
                            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
                        {messages.length === 0 && (
                            <div className="flex h-full items-center justify-center px-4">
                                <div className="text-center">
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                                        DubAI
                                    </h2>
                                    <p className="mt-4 sm:mt-8 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                        Ask me anything about UW events, activities, and campus life.
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${message.role === 'user'
                                        ? 'bg-linear-to-r from-purple-600 to-purple-700 text-white'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap wrap-break-word text-sm sm:text-base">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 safe-area-bottom">
                    <div className="mx-auto max-w-3xl px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-end gap-2 rounded-xl sm:rounded-2xl border border-gray-300 bg-white p-2 sm:p-3 shadow-sm dark:border-gray-600 dark:bg-gray-800 transition-shadow focus-within:shadow-md focus-within:border-purple-400 dark:focus-within:border-purple-500">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Message DubAI..."
                                rows={1}
                                className="max-h-32 flex-1 resize-none border-none bg-transparent px-2 py-2 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
                            />
                            <button
                               onClick={handleSend}
                               disabled={!input.trim() || isLoading}
                               className="rounded-lg sm:rounded-xl bg-linear-to-r from-purple-600 to-purple-700 p-2.5 sm:p-3 text-white transition-all hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                               aria-label="Send message"
                            >
                                {isLoading ? (
                                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
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

