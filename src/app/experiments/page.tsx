'use client';

import React from 'react';
import NavBar from '../../components/NavBar';
import { useRouter } from 'next/navigation';

export default function ExperimentsPage() {
  const router = useRouter();

  const experiments = [
    {
      id: 'map',
      title: 'Campus Snap Map',
      description: 'Geospatial view of events happening right now.',
      path: '/experiments/map',
      icon: '🗺️',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Experiments Lab</h1>
        <p className="text-gray-600 mb-8">
          Test new features for bugs and feedback before they go live.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map((exp) => (
            <button
              key={exp.id}
              onClick={() => router.push(exp.path)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-500 transition-all text-left group"
            >
              <div className="text-4xl mb-4">{exp.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {exp.title}
              </h3>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
