'use client';

import NavBar from '@/components/NavBar';
import ForYouFeed from '@/components/ForYouFeed';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <NavBar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <ForYouFeed />
        </div>
      </div>
    </div>
  );
}
