# "For You" Page Documentation

## 1. Overview

The "For You" page is the central hub of DubAI, designed to deliver personalized event and club recommendations to students. It uses a multi-tenant architecture to adapt to different universities (e.g., UW, WSU) while providing a unified, engaging user experience similar to Instagram or TikTok.

## 2. Current Implementation (Phase 1)

**Status:** ✅ Live (Demo Mode)

### Core Features

- **Multi-Tenant Support:** Automatically loads configuration (Majors, Branding) based on the user's organization.
- **Dynamic Onboarding:** A wizard that asks for Major, Year, and Interests to build a user profile.
- **Matchmaker Algorithm (v1):** A deterministic scoring system that ranks events based on:
  - **Major Match:** +10 points
  - **Interest Tag Match:** +5 points
  - **Identity Match (e.g., Freshman):** +5 points
- **Feed UI:** A responsive grid of content cards displaying Event/Club details.

### Key Components

- `src/app/foryou/page.tsx`: The main page container.
- `src/components/OnboardingWizard.tsx`: Handles user profile creation.
- `src/components/ForYouFeed.tsx`: Displays the ranked content.
- `src/config/organizations.ts`: Defines tenant-specific data.

---

## 3. Planned Experiments (Phase 2)

We are developing experimental features to increase engagement and social interaction.

### 3.1 Visual Overhaul (Instagram Style)

- **Goal:** Make the feed visually immersive.
- **Changes:**
  - Redesign `ContentCard` to be image-first.
  - Add "Save" (Bookmark) and "Share" buttons.
  - Add "Social Proof" badges (e.g., "12 people going").

### 3.2 Club Stories

- **Goal:** Create urgency and daily engagement.
- **Implementation:**
  - A horizontal scroll bar at the top of the feed.
  - Circular avatars for Clubs.
  - Clicking opens a full-screen "Story" (image/video) with a 24h expiry.

### 3.3 Swipe Mode (Discovery)

- **Goal:** Gamify discovery and rapidly train the AI.
- **Implementation:**
  - A "Deck" view of event cards.
  - Swipe Right = Save & Boost Tag Score.
  - Swipe Left = Hide & Lower Tag Score.
  - _Tech:_ Uses `framer-motion` for physics (or simple buttons for v1).

### 3.4 Campus Snap Map

- **Goal:** Help users find events happening _now_ nearby.
- **Implementation:**
  - A map view (Leaflet or Mock CSS Map).
  - Pins for active events.
  - Heatmaps for high-activity zones (e.g., The HUB, Red Square).

### 3.5 AI "Hype" Summary

- **Goal:** Reduce decision fatigue.
- **Implementation:**
  - Use LLM to summarize event descriptions into a "Vibe Check".
  - Display as a highlighted badge (e.g., "✨ Free Food & Networking").

---

## 4. Data Model Requirements

To support these features, the `ContentItem` and `User` models need to be extended:

```typescript
interface ContentItem {
  // ... existing fields
  location?: { lat: number; lng: number; name: string }; // For Map
  attendees?: { count: number; friends: string[] }; // For Social Proof
  images: string[]; // For Visual Cards
  stories?: { id: string; imageUrl: string; expiresAt: Date }[]; // For Stories
  aiSummary?: string; // For Hype Check
}
```

## 5. Roadmap

1.  **Refactor Data Models:** Update `mockData.ts` with new fields.
2.  **Build Experiments:** Create separate pages for Map, Swipe, and Stories.
3.  **User Testing:** Test experiments with users to see which features stick.
4.  **Integration:** Merge successful experiments into the main "For You" feed.
