'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function NavBar() {
    const handleProfileClick = () => {
        console.log('profile');
    };

    return (
        <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 md:px-8 py-3 sm:py-4">
            <Link href="/" className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                DubAI
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <Link
                    href="/chat"
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 sm:px-3 md:px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="font-medium text-sm sm:text-base hidden xs:inline">Chat</span>
                </Link>
                <ThemeToggle />
                <button
                    onClick={handleProfileClick}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
                    aria-label="Profile"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-white"
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

