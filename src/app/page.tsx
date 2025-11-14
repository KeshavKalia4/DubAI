'use client';

import NavBar from '@/components/NavBar';

export default function Home() {
  const handleUserClick = () => {
    console.log('user');
  };

  const handleContributorClick = () => {
    console.log('contributor');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 font-sans">
      <NavBar />
      <main className="flex flex-1 flex-col items-center px-6 py-8">
        <div className="flex w-full max-w-5xl flex-col items-center gap-12 text-center">
          <div className="flex flex-col gap-3 pt-8">
            <h1 className="text-7xl font-bold text-white">
              DUBAI
            </h1>
            <p className="text-lg text-purple-100">
              Your AI-powered assistant for University of Washington events and
              information
            </p>
          </div>
          <div className="flex w-full max-w-3xl gap-6">
            <button
              onClick={handleUserClick}
              className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg bg-white px-8 py-12 text-center transition-all hover:shadow-lg hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-10 w-10 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
              <span className="text-2xl font-bold text-gray-900">User</span>
              <p className="text-sm text-gray-600">
                Ask questions and get information about UW events, activities, and campus life
              </p>
            </button>
            <button
              onClick={handleContributorClick}
              className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg bg-white px-8 py-12 text-center transition-all hover:shadow-lg hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-10 w-10 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              <span className="text-2xl font-bold text-gray-900">Contributor</span>
              <p className="text-sm text-gray-600">
                Submit event information and help improve our AI knowledge base
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
