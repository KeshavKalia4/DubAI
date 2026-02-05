'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { MessageCircle, Menu, MapPin, LogOut, Settings, User, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavBarProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export default function NavBar({ onMenuClick, showMenuButton = false }: NavBarProps) {
    const { user, signOut } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleProfileClick = () => setIsDropdownOpen((prev) => !prev);
    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await signOut();
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-purple-600 overflow-visible px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center">
                    {showMenuButton && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg hover:bg-purple-500 mr-2"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="w-6 h-6 text-white" />
                        </button>
                    )}

                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold text-xl text-white">FindMyEvents</span>
                    </Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/chat"
                        className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors ${showMenuButton ? 'hidden lg:flex' : ''}`}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium hidden md:inline">Chat</span>
                    </Link>

                    <Link
                        href="/experiments/map"
                        className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors ${showMenuButton ? 'hidden lg:flex' : ''}`}
                    >
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium hidden md:inline">Campus Map</span>
                    </Link>

                    {/* Profile Button */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={handleProfileClick}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="Profile"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 text-purple-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <>
                                {/* Backdrop overlay */}
                                <div
                                    className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                                    style={{ zIndex: 9998 }}
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                {/* Dropdown menu */}
                                <div
                                    className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                                    style={{ zIndex: 9999 }}
                                >
                                    {user ? (
                                        <>
                                            <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                                                <p className="text-xs text-purple-500 font-medium uppercase tracking-wider mb-1">Signed in as</p>
                                                <p className="text-sm text-gray-800 font-semibold truncate">{user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    href="/my-events"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                                >
                                                    <CalendarCheck className="w-4 h-4" />
                                                    <span className="font-medium">My Events</span>
                                                </Link>
                                                <Link
                                                    href="/preferences"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span className="font-medium">Preferences</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="font-medium">Sign Out</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-2">
                                            <Link
                                                href="/login"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                <span className="font-medium">Sign In</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
