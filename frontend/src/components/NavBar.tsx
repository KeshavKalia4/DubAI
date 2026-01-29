'use client';

import Link from 'next/link';
import { MessageCircle, Sparkles, Menu, MapPin } from 'lucide-react';

interface NavBarProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export default function NavBar({ onMenuClick, showMenuButton = false }: NavBarProps) {
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
                </div>
            </div>
        </nav>
    );
}
