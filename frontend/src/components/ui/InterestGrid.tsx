'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { EVENT_TAGS } from '@/data/eventTags';

/**
 * InterestGrid Component
 *
 * A reusable grid of interest tags for multi-selecting topics.
 * Used in onboarding and settings pages.
 */

interface InterestGridProps {
  /** Label text displayed above the grid */
  label?: string;
  /** Currently selected tag IDs */
  selectedTags: string[];
  /** Callback when selection changes */
  onChange: (tags: string[]) => void;
  /** Hint text displayed below the grid */
  hint?: string;
  /** Show selected count */
  showCount?: boolean;
}

export function InterestGrid({
  label,
  selectedTags,
  onChange,
  hint,
  showCount = true,
}: InterestGridProps) {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
          {label}
        </label>
      )}

      {/* Tag Grid */}
      <div className="flex flex-wrap gap-2.5">
        {EVENT_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <motion.button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                isSelected
                  ? 'bg-[var(--uw-purple)] border-[var(--uw-purple)] text-white'
                  : 'bg-white/5 border-white/10 text-[var(--text-secondary)] hover:border-white/20 hover:text-white'
              }`}
            >
              {tag.label}
            </motion.button>
          );
        })}
      </div>

      {/* Hint Text */}
      {hint && (
        <p className="text-xs text-[var(--text-tertiary)] mt-3">
          {hint}
        </p>
      )}

      {/* Selected Count */}
      {showCount && selectedTags.length > 0 && (
        <p className="text-xs text-[var(--uw-gold)] mt-2">
          {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
