'use client';

import Link from 'next/link';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function NavBar() {
    const handleProfileClick = () => {
        console.log('profile');
    };

    return (
        <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#1a0f2e]/85 backdrop-blur-xl border-b border-[#362955] px-4 sm:px-6 md:px-8 py-3 sm:py-4 shadow-sm">
            {/* Logo with gradient */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-[#8268bc] to-[#9982d0] shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-[#8268bc] to-[#9982d0] bg-clip-text text-transparent">
                    DubAI
                </span>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-2 sm:gap-3">
                <Link
                    href="/chat"
                    className="flex items-center gap-1.5 sm:gap-2 text-[#d4d4d4] hover:text-[#8268bc] transition-all px-2 sm:px-3 md:px-4 py-2 rounded-xl hover:bg-[#362955] border border-transparent hover:border-[#8268bc]/30"
                >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                    <span className="font-semibold text-sm sm:text-base hidden xs:inline">Chat</span>
                </Link>

                {/* Profile Button */}
                <button
                    onClick={handleProfileClick}
                    className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-linear-to-br from-[#8268bc] to-[#9982d0] hover:from-[#9982d0] hover:to-[#a896e0] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 overflow-hidden group"
                    aria-label="Profile"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-linear-to-r from-[#6b4ea8] to-[#8268bc] blur-lg"></div>
                    </div>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-white relative z-10"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                    </svg>
                </button>
            </div>
        </nav>
    );
}

