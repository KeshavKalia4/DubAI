# DubAI Frontend

Next.js 16 application providing a personalized university experience through the "For You" feed, chat assistant, and multi-tenant support.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **State**: Custom hooks + localStorage
- **Deployment**: Vercel

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage (For You feed)
│   │   ├── chat/              # Chat assistant
│   │   ├── user/              # User profile
│   │   └── contributor/       # Contributor portal (unlisted)
│   ├── components/             # React components
│   │   ├── NavBar.tsx         # Navigation
│   │   ├── OnboardingInformation.tsx  # User onboarding wizard
│   │   ├── ForYouFeed.tsx     # Personalized content feed
│   │   └── ChatInterface.tsx  # Chat UI
│   ├── config/
│   │   └── organizations.ts   # Multi-tenant configuration
│   ├── hooks/                  # Custom React hooks
│   │   ├── useLocalStorage.ts # Generic localStorage hook
│   │   └── useUserProfile.ts  # User profile state management
│   └── types/
│       └── index.ts           # TypeScript interfaces
└── public/                     # Static assets
```

---

## Core Features

### 1. Multi-Tenant Organization System

Configuration-driven support for multiple universities:

**Location**: `src/config/organizations.ts`

```typescript
export const organizations: Record<string, Organization> = {
  "uw-seattle": {
    id: "uw-seattle",
    name: "University of Washington",
    domains: ["uw.edu", "washington.edu"],
    branding: { primaryColor: "#4b2e83" },
    onboardingConfig: {
      majors: ["Informatics", "Computer Science", "Business", ...],
      campuses: ["Seattle", "Tacoma", "Bothell"]
    }
  }
};
```

### 2. Dynamic Onboarding

**Component**: `OnboardingInformation.tsx`

Adapts questionnaire based on user's organization:
- Email domain detection → organization assignment
- Dynamic major/campus options
- Interest tag selection
- Profile saved to localStorage (Phase 1) / database (Phase 2)

### 3. For You Feed

**Component**: `ForYouFeed.tsx`

Personalized content feed using the Matchmaker algorithm:
- Filters content by user's organization
- Scores items based on tag matches
- Responsive grid layout
- Visual content cards

**Current Implementation:**
- ✅ Tag-based scoring
- ✅ Organization filtering
- ✅ Responsive design
- 🔄 Mock data (transitioning to live data)

---

## Planned Features (Phase 2)

### Visual Enhancements

**Instagram-Style Feed:**
- Image-first content cards
- Save/bookmark buttons
- Social proof badges ("12 people going")
- Enhanced visual hierarchy

### Club Stories

**Implementation:**
- Horizontal scroll bar at top of feed
- Circular club avatars
- Full-screen story view (image/video)
- 24-hour expiry

**Data Model Extension:**
```typescript
interface ContentItem {
  // ... existing fields
  stories?: {
    id: string;
    imageUrl: string;
    expiresAt: Date;
  }[];
}
```

### Swipe Mode (Discovery)

**Goal:** Gamify event discovery and train AI preferences

**Implementation:**
- Tinder-style card deck
- Swipe right → Save + boost tag scores
- Swipe left → Hide + lower tag scores
- Uses `framer-motion` for physics

### Campus Snap Map

**Goal:** Show live events happening nearby

**Implementation:**
- Interactive map view (Leaflet or CSS map)
- Event pins with real-time data
- Heatmaps for high-activity zones
- Location-based filtering

**Data Model Extension:**
```typescript
interface ContentItem {
  // ... existing fields
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
}
```

### AI Hype Summary

**Goal:** Reduce decision fatigue with quick event summaries

**Implementation:**
- LLM-generated "vibe check" for each event
- Highlighted badge (e.g., "✨ Free Food & Networking")
- One-sentence summary

---

## State Management

### Custom Hooks

**`useLocalStorage<T>`** (`src/hooks/useLocalStorage.ts`)

Generic hook for type-safe localStorage:
- Handles SSR hydration safely
- Returns `useState`-like API
- Automatic JSON serialization

```typescript
const [value, setValue] = useLocalStorage<string>('key', 'default');
```

**`useUserProfile`** (`src/hooks/useUserProfile.ts`)

Manages user profile state:
- Wraps `useLocalStorage` for profile data
- Exposes `profile`, `setProfile`, `clearProfile`
- Handles loading states for SSR

```typescript
const { profile, setProfile, clearProfile, isLoading } = useUserProfile();
```

### Data Flow

1. User completes onboarding → `setProfile(userProfile)`
2. Profile stored in localStorage
3. `ForYouFeed` receives profile → fetches/filters content
4. Refresh page → profile persists

---

## Key Components

### NavBar

**File**: `src/components/NavBar.tsx`

Navigation header with:
- DubAI logo (links to home)
- Chat button (links to `/chat`)
- Profile button (future: dropdown menu)

### OnboardingInformation

**File**: `src/components/OnboardingInformation.tsx`

Multi-step wizard:
1. Major selection (organization-specific)
2. Year/campus selection
3. Interest tags
4. Submit → creates `UserProfile`

**Props:**
```typescript
{
  onComplete: (profile: UserProfile) => void;
}
```

### ForYouFeed

**File**: `src/components/ForYouFeed.tsx`

Displays ranked content:
- Receives `UserProfile` as prop
- Filters content by organization
- Scores using Matchmaker algorithm
- Renders content cards in grid

**Props:**
```typescript
{
  user: UserProfile;
}
```

### ChatInterface

**File**: `src/components/ChatInterface.tsx`

AI chat assistant:
- Message input/display
- Integration with Anthropic/OpenAI API
- Context-aware responses about campus

---

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | For You feed (homepage) |
| `/chat` | `app/chat/page.tsx` | Chat assistant |
| `/user` | `app/user/page.tsx` | User profile settings |
| `/contributor` | `app/contributor/page.tsx` | Unlisted contributor portal |

---

## Development Patterns

### TypeScript Interfaces

**Location**: `src/types/index.ts`

Key interfaces:
- `Organization` - University/tenant config
- `UserProfile` - User data and tags
- `ContentItem` - Events/clubs/announcements

### Conditional Rendering

Homepage shows onboarding OR feed based on profile state:

```typescript
export default function Home() {
  const { profile, setProfile, isLoading } = useUserProfile();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <NavBar />
      {!profile ? (
        <OnboardingInformation onComplete={setProfile} />
      ) : (
        <ForYouFeed user={profile} />
      )}
    </>
  );
}
```

### SSR Considerations

- `useLocalStorage` handles server/client hydration mismatch
- `isLoading` state prevents flash of incorrect content
- `useState` with `useEffect` for client-only code

---

## Testing Strategy

### Manual Testing Checklist

**New User Flow:**
1. Open in incognito → see onboarding
2. Complete wizard → see personalized feed
3. Refresh → feed persists (no re-onboarding)

**Returning User:**
1. Open normally → see feed (if profile exists)
2. Clear profile → see onboarding again

**Navigation:**
1. Click Chat in NavBar → goes to `/chat`
2. Click logo → returns to homepage

**Multi-Tenant:**
1. Change mock organization → see different majors/branding
2. Content filtered correctly per org

---

## Future Development

### Phase 2 Roadmap

1. **Refactor Data Models**: Add `location`, `attendees`, `images`, `stories` fields
2. **Build Experiments**: Separate pages for Map, Swipe Mode, Stories
3. **User Testing**: Test engagement with each feature
4. **Integration**: Merge successful experiments into main feed

### Database Integration

Replace mock data with Supabase:
- User authentication
- Real-time content updates
- Profile persistence
- Social features (RSVPs, bookmarks)

### AI Enhancements

- Embedding-based recommendations
- Natural language search
- Auto-generated event summaries
- Personalized push notifications

---

## Contributing

Follow existing patterns:
- Use TypeScript for type safety
- Use Tailwind for styling (no custom CSS)
- Create reusable components
- Document props with TypeScript interfaces

---

*See [../README.md](../README.md) for overall project architecture*
