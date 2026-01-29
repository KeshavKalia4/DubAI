'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { Sparkles, Check } from 'lucide-react';

interface Tag {
  id: string;
  label: string;
  category: 'topic' | 'identity' | 'career' | 'major';
}

const defaultTags: Tag[] = [
  // Topics
  { id: 'technology', label: 'Technology', category: 'topic' },
  { id: 'sports', label: 'Sports', category: 'topic' },
  { id: 'music', label: 'Music', category: 'topic' },
  { id: 'art', label: 'Art', category: 'topic' },
  { id: 'gaming', label: 'Gaming', category: 'topic' },
  { id: 'volunteering', label: 'Volunteering', category: 'topic' },
  { id: 'culture', label: 'Culture', category: 'topic' },
  { id: 'wellness', label: 'Wellness', category: 'topic' },

  // Majors
  { id: 'computer-science', label: 'Computer Science', category: 'major' },
  { id: 'business', label: 'Business', category: 'major' },
  { id: 'engineering', label: 'Engineering', category: 'major' },
  { id: 'biology', label: 'Biology', category: 'major' },
  { id: 'psychology', label: 'Psychology', category: 'major' },
  { id: 'communications', label: 'Communications', category: 'major' },

  // Career
  { id: 'internships', label: 'Internships', category: 'career' },
  { id: 'networking', label: 'Networking', category: 'career' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', category: 'career' },
  { id: 'research', label: 'Research', category: 'career' },
];

export default function PreferencesPage() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved tags from localStorage
    const savedTags = localStorage.getItem('user-tags');
    if (savedTags) {
      setSelectedTags(JSON.parse(savedTags));
    }
  }, []);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('user-tags', JSON.stringify(selectedTags));
    setSaved(true);
    // Redirect to home after a short delay
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const groupedTags = defaultTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  const categoryLabels = {
    topic: 'Topics',
    major: 'Majors',
    career: 'Career',
    identity: 'Identity',
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#1a0f2e] via-[#0f0a1a] to-[#1e1528]">
      <NavBar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Your Preferences
              </h1>
            </div>
            <p className="text-[#a3a3a3] text-lg">
              Select your interests to personalize your event recommendations
            </p>
          </div>

          {/* Tag Categories */}
          <div className="space-y-8">
            {Object.entries(groupedTags).map(([category, tags]) => (
              <div key={category} className="bg-[#2a1f47]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#8268bc]/30">
                <h2 className="text-xl font-bold text-white mb-4">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-300 transform active:scale-95 ${
                          isSelected
                            ? 'bg-white text-purple-700 border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.5)] ring-2 ring-white/50 ring-offset-2 ring-offset-[#2a1f47]'
                            : 'bg-transparent text-white/90 border-white/30 hover:border-white hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 inline mr-1.5 animate-bounce" />}
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={selectedTags.length === 0}
              className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5 inline mr-2" />
                  Saved!
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
