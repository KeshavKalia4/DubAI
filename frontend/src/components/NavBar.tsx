'use client';

import Link from 'next/link';

export default function NavBar() {
    const handleProfileClick = () => {
        console.log('profile');
    };

    return (
        <nav className="flex w-full items-center justify-between bg-[#1A1A2E] px-6 py-4">
            <Link href="/" className="text-xl font-semibold text-white hover:text-purple-300 transition-colors">
                DubAI
            </Link>
            <button
                onClick={handleProfileClick}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
                aria-label="Profile"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                </svg>
            </button>
        </nav>
    );
}

