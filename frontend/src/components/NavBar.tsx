'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Sparkles, Menu, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavBarProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export default function NavBar({ onMenuClick, showMenuButton = false }: NavBarProps) {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isDropdownOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        const timer = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await signOut();
        router.push('/login');
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
                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
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
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden" style={{ zIndex: 9999 }}>
                                {user && (
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                    </div>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
