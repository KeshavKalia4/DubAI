'use client';

import Link from 'next/link';
import { MessageCircle, Sparkles, Menu } from 'lucide-react';

interface NavBarProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export default function NavBar({ onMenuClick, showMenuButton = false }: NavBarProps) {
    const handleProfileClick = () => {
        console.log('profile');
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#1a0f2e]/85 backdrop-blur-xl border-b border-[#362955] px-4 sm:px-6 md:px-8 py-3 sm:py-4 shadow-sm">
            <div className="flex items-center justify-between relative">
                {/* Left Section - Hamburger on mobile, Logo on desktop */}
                <div className="flex items-center lg:flex-1">
                    {/* Mobile Hamburger Menu */}
                    {showMenuButton && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden h-10 w-10 rounded-xl hover:bg-[#362955] transition-all bg-transparent flex items-center justify-center"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="w-6 h-6 text-[#8268bc]" strokeWidth={2} />
                        </button>
                    )}

                    {/* Desktop Logo (hidden on mobile) */}
                    <Link href="/" className="hidden lg:flex items-center gap-2 group">
                        <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-[#8268bc] to-[#9982d0] shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-[#8268bc] to-[#9982d0] bg-clip-text text-transparent">
                            DubAI
                        </span>
                    </Link>
                </div>

                {/* Center Section - Logo on mobile only */}
                <Link href="/" className="flex lg:hidden items-center gap-2 group absolute left-1/2 -translate-x-1/2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-br from-[#8268bc] to-[#9982d0] shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold bg-linear-to-r from-[#8268bc] to-[#9982d0] bg-clip-text text-transparent">
                        DubAI
                    </span>
                </Link>

                {/* Right Section - Navigation Items */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Chat Link - Hidden on mobile, visible on desktop */}
                    <Link
                        href="/chat"
                        className="hidden lg:flex items-center gap-1.5 sm:gap-2 text-[#d4d4d4] hover:text-[#8268bc] transition-all px-2 sm:px-3 md:px-4 py-2 rounded-xl hover:bg-[#362955] border border-transparent hover:border-[#8268bc]/30"
                    >
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                        <span className="font-semibold text-sm sm:text-base">Chat</span>
                    </Link>

                    {/* Profile Button */}
                    <button
                        onClick={handleProfileClick}
                        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#8268bc] to-[#9982d0] hover:from-[#9982d0] hover:to-[#a896e0] shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 ring-2 ring-[#362955] hover:ring-[#8268bc]/50"
                        aria-label="Profile"
                        style={{ aspectRatio: '1/1', minWidth: '2.5rem', minHeight: '2.5rem' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="h-5 w-5 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}

