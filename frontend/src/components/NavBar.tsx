'use client';

import Link from 'next/link';
import { MessageCircle, Sparkles, Menu, MapPin } from 'lucide-react';

interface NavBarProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export default function NavBar({ onMenuClick, showMenuButton = false }: NavBarProps) {
    const handleProfileClick = () => {
        console.log('profile');
    };

    return (
        <nav
            className="sticky top-0 z-50 w-full bg-[#1a0f2e]/85 backdrop-blur-xl shadow-sm"
            style={{
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '16px',
                paddingBottom: '16px',
                height: '72px',
                minHeight: '72px',
                maxHeight: '72px',
                borderBottom: '1px solid #362955',
                boxSizing: 'border-box'
            }}
        >
            <div className="flex items-center justify-between relative" style={{ gap: '24px', height: '40px' }}>
                {/* Left Section - Hamburger on mobile, Logo on desktop */}
                <div className={`flex items-center ${showMenuButton ? 'lg:flex-1' : 'flex-1'}`} style={{ height: '40px' }}>
                    {/* Mobile Hamburger Menu - Only on Chat page */}
                    {showMenuButton && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden rounded-xl hover:bg-[#362955] transition-all bg-transparent flex items-center justify-center"
                            style={{ width: '40px', height: '40px' }}
                            aria-label="Toggle sidebar"
                        >
                            <Menu style={{ width: '24px', height: '24px' }} className="text-[#8268bc]" strokeWidth={2} />
                        </button>
                    )}

                    {/* Logo - For Chat page: hidden on mobile, For Home page: always visible on left */}
                    {!showMenuButton && (
                        <Link href="/" className="flex items-center group" style={{ gap: '8px' }}>
                            <div className="flex items-center justify-center rounded-xl bg-linear-to-br from-[#8268bc] to-[#9982d0] shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200" style={{ width: '36px', height: '36px' }}>
                                <Sparkles style={{ width: '20px', height: '20px' }} className="text-white" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold bg-linear-to-r from-[#8268bc] to-[#9982d0] bg-clip-text text-transparent" style={{ fontSize: '24px', lineHeight: '32px' }}>
                                DubAI
                            </span>
                        </Link>
                    )}

                    {/* Logo - For Chat page: desktop only on left */}
                    {showMenuButton && (
                        <Link href="/" className="hidden lg:flex items-center group" style={{ gap: '8px' }}>
                            <div className="flex items-center justify-center rounded-xl bg-linear-to-br from-[#8268bc] to-[#9982d0] shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200" style={{ width: '36px', height: '36px' }}>
                                <Sparkles style={{ width: '20px', height: '20px' }} className="text-white" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold bg-linear-to-r from-[#8268bc] to-[#9982d0] bg-clip-text text-transparent" style={{ fontSize: '24px', lineHeight: '32px' }}>
                                DubAI
                            </span>
                        </Link>
                    )}
                </div>

                {/* Center Section - Logo on mobile only for Chat page */}
                {showMenuButton && (
                    <Link href="/" className="flex lg:hidden items-center group absolute left-1/2 -translate-x-1/2" style={{ gap: '8px' }}>
                        <div className="flex items-center justify-center rounded-xl bg-linear-to-br from-[#8268bc] to-[#9982d0] shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200" style={{ width: '36px', height: '36px' }}>
                            <Sparkles style={{ width: '20px', height: '20px' }} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-bold bg-linear-to-r from-[#8268bc] to-[#9982d0] bg-clip-text text-transparent" style={{ fontSize: '24px', lineHeight: '32px' }}>
                            DubAI
                        </span>
                    </Link>
                )}

                {/* Right Section - Navigation Items */}
                <div className="flex items-center" style={{ gap: '24px', height: '40px' }}>
                    {/* Chat Link - For Chat page: hidden on mobile, For Home page: always visible */}
                    <Link
                        href="/chat"
                        className={`flex items-center text-[#d4d4d4] hover:text-[#8268bc] transition-colors duration-200 ${
                            showMenuButton ? 'hidden lg:flex' : ''
                        }`}
                        style={{ gap: '8px' }}
                    >
                        <MessageCircle style={{ width: '20px', height: '20px' }} strokeWidth={2} />
                        <span className={`font-semibold ${showMenuButton ? '' : 'hidden md:inline'}`} style={{ fontSize: '16px', lineHeight: '24px' }}>Chat</span>
                    </Link>

                    {/* Campus Map Link - For Chat page: hidden on mobile, For Home page: always visible */}
                    <Link
                        href="/experiments/map"
                        className={`flex items-center text-[#d4d4d4] hover:text-[#8268bc] transition-colors duration-200 ${
                            showMenuButton ? 'hidden lg:flex' : ''
                        }`}
                        style={{ gap: '8px' }}
                    >
                        <MapPin style={{ width: '20px', height: '20px' }} strokeWidth={2} />
                        <span className={`font-semibold ${showMenuButton ? '' : 'hidden md:inline'}`} style={{ fontSize: '16px', lineHeight: '24px' }}>Campus Map</span>
                    </Link>

                    {/* Profile Button */}
                    <button
                        onClick={handleProfileClick}
                        className="relative flex items-center justify-center rounded-full bg-linear-to-br from-[#8268bc] to-[#9982d0] hover:from-[#9982d0] hover:to-[#a896e0] shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 ring-2 ring-[#362955] hover:ring-[#8268bc]/50"
                        aria-label="Profile"
                        style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="text-white"
                            style={{ width: '20px', height: '20px' }}
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

