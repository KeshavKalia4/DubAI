'use client';

import { useRouter } from 'next/navigation';
import { Users, Calendar } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1025] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects - matching explore/reels style */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8268bc]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        {/* Bottom-right glow */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
        {/* Center accent glow */}
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#6b4ea8]/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo/Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#f5f5f5] via-[#e0e0e0] to-[#d4d4d4] bg-clip-text text-transparent">
            FindMyEvents
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-[#a3a3a3] mb-12">
          Discover and share campus events at UW
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          {/* User Button */}
          <button
            onClick={() => router.push('/explore')}
            className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-[0_8px_30px_rgba(107,78,168,0.4)] hover:shadow-[0_12px_40px_rgba(107,78,168,0.5)] hover:scale-105 border border-purple-500/50"
          >
            <Users className="w-6 h-6" />
            <span>I'm a User</span>
          </button>

          {/* Contributor Button */}
          <button
            onClick={() => router.push('/contribute')}
            className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-[#2a1f47]/80 hover:bg-[#362955] text-white rounded-2xl font-semibold text-lg transition-all duration-300 border-2 border-[#8268bc]/30 hover:border-[#8268bc]/60 shadow-[0_8px_30px_rgba(107,78,168,0.25)] hover:shadow-[0_12px_40px_rgba(107,78,168,0.35)] hover:scale-105 backdrop-blur-sm"
          >
            <Calendar className="w-6 h-6" />
            <span>I'm a Contributor</span>
          </button>
        </div>

        {/* Info cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-5 shadow-[0_8px_30px_rgba(107,78,168,0.25)]">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[#8268bc]" />
              <h3 className="font-semibold text-[#f5f5f5]">For Users</h3>
            </div>
            <p className="text-sm text-[#d4d4d4]">
              Discover events personalized to your interests. Never miss out on what's happening on campus.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#1e1432]/95 to-[#2a1f47]/80 backdrop-blur-md border-2 border-[#8268bc]/30 rounded-2xl p-5 shadow-[0_8px_30px_rgba(107,78,168,0.25)]">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-[#8268bc]" />
              <h3 className="font-semibold text-[#f5f5f5]">For Contributors</h3>
            </div>
            <p className="text-sm text-[#d4d4d4]">
              RSO leaders can submit events and reach students who are interested in what you're hosting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
