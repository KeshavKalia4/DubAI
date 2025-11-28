'use client';

import React, { useMemo } from 'react';
import { ContentItem, UserProfile } from '../types';
import { mockContent } from '../data/mockData';
import { badges } from '@/config/designTokens';

interface ForYouFeedProps {
  user: UserProfile;
}

const ForYouFeed: React.FC<ForYouFeedProps> = ({ user }) => {
  const recommendations = useMemo(() => {
    // 1. Filter by Organization
    const orgContent = mockContent.filter(
      (item) => item.organizationId === user.organizationId
    );

    // 2. Score Content
    const scoredContent = orgContent.map((item) => {
      let score = 0;

      // Exact tag matches
      const matchingTags = item.tags.filter((tag) => user.tags.includes(tag));
      score += matchingTags.length * 5;

      // Major match (if content tag matches user major)
      if (user.major && item.tags.includes(user.major.toLowerCase())) {
        score += 10;
      }

      // Identity match (simple check for now)
      if (user.year === 'Freshman' && item.tags.includes('freshman')) {
        score += 5;
      }

      return { item, score };
    });

    // 3. Sort by Score (Descending)
    return scoredContent
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [user]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
      {recommendations.length === 0 && (
        <p className="text-gray-500">No recommendations found. Try adding more interests!</p>
      )}
    </div>
  );
};

const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text text-xs font-semibold px-2 py-1 rounded uppercase ${badges[item.type].bg} ${badges[item.type].text}`}
        >
          {item.type}
        </span>
        {item.date && (
          <span className="text-xs text-gray-500" suppressHydrationWarning>
            {new Date(item.date).toLocaleDateString()}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold mb-1 text-gray-900">{item.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
      <div className="flex flex-wrap gap-1">
        {item.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ForYouFeed;
