# Phase 1: Replace Homepage with For You Page

## Problem Statement

**Current State:**
- Homepage (`/`) shows a landing page with 3 cards: User, Contributor, For You Demo
- For You page exists at `/foryou` with onboarding + personalized feed
- Users must click through to access the main experience
- No persistence - users repeat onboarding every visit
- NavBar only has logo and profile button (no navigation)

**Target State:**
- Homepage (`/`) IS the For You experience
- First-time users see onboarding, returning users see their feed
- User preferences persist in localStorage (future: database)
- NavBar includes navigation to Chat feature
- Contributor page remains accessible via direct URL (unlisted)
- Architecture supports multi-university deployment

---

## Architecture Analysis

### Existing Patterns to Leverage
| Pattern | Location | How We'll Use It |
|---------|----------|------------------|
| Organization config | `src/config/organizations.ts` | Dynamic university branding/config |
| UserProfile type | `src/types/index.ts` | Store in localStorage |
| Onboarding flow | `src/components/OnboardingInformation.tsx` | Reuse as-is |
| ForYouFeed | `src/components/ForYouFeed.tsx` | Reuse as-is |

### New Patterns to Introduce
| Pattern | Purpose | Learning Concept |
|---------|---------|------------------|
| Custom Hook (`useUserProfile`) | Encapsulate localStorage logic | React Hooks, State Management |
| Conditional rendering | Show onboarding vs feed | React patterns |
| Type-safe localStorage | Persist UserProfile | TypeScript generics |

### Files Overview
| Action | File | Purpose |
|--------|------|---------|
| **Modify** | `src/app/page.tsx` | Replace landing with For You experience |
| **Modify** | `src/components/NavBar.tsx` | Add Chat navigation button |
| **Create** | `src/hooks/useLocalStorage.ts` | Generic localStorage hook |
| **Create** | `src/hooks/useUserProfile.ts` | User profile state management |
| **Delete** | `src/app/foryou/page.tsx` | No longer needed (merged into home) |

---

## Implementation Steps

### Step 1: Create localStorage Hook
- [ ] Create `src/hooks/useLocalStorage.ts`
- [ ] Implement generic `useLocalStorage<T>` hook
- [ ] Handle SSR (server-side rendering) safely
- [ ] Add type safety for stored values

**Learning Focus:** TypeScript generics, React hooks, SSR considerations

### Step 2: Create useUserProfile Hook
- [ ] Create `src/hooks/useUserProfile.ts`
- [ ] Use `useLocalStorage` to persist UserProfile
- [ ] Expose `profile`, `setProfile`, `clearProfile`
- [ ] Handle null/undefined states

**Learning Focus:** Custom hooks composition, separation of concerns

### Step 3: Update NavBar with Chat Navigation
- [ ] Add Chat button/link to NavBar
- [ ] Use lucide-react icons for consistency
- [ ] Maintain responsive design

**Learning Focus:** Next.js Link component, component composition

### Step 4: Replace Homepage Content
- [ ] Import and use `useUserProfile` hook
- [ ] Show `OnboardingInformation` if no profile
- [ ] Show `ForYouFeed` if profile exists
- [ ] Add "Reset Profile" option for demo/testing
- [ ] Remove old landing page content

**Learning Focus:** Conditional rendering, component composition

### Step 5: Clean Up
- [ ] Delete `/foryou/page.tsx` (functionality moved to home)
- [ ] Update any links pointing to `/foryou`
- [ ] Verify `/contributor` still works (unlisted)
- [ ] Test full flow: new user → onboarding → feed → refresh (persists)

**Learning Focus:** Code cleanup, testing user flows

---

## Code Examples

### Step 1: useLocalStorage Hook Signature
```typescript
// src/hooks/useLocalStorage.ts
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void]
```

**Why this design:**
- Generic `<T>` allows reuse for any data type
- Returns tuple like `useState` for familiar API
- Handles hydration mismatch (SSR vs client)

### Step 2: useUserProfile Hook Signature
```typescript
// src/hooks/useUserProfile.ts
function useUserProfile(): {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  isLoading: boolean;  // For hydration state
}
```

### Step 3: NavBar Update
```typescript
// Add to NavBar.tsx
<Link href="/chat" className="...">
  <MessageCircle className="h-5 w-5" />
  <span>Chat</span>
</Link>
```

### Step 4: Homepage Structure
```typescript
// src/app/page.tsx
export default function Home() {
  const { profile, setProfile, clearProfile, isLoading } = useUserProfile();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <NavBar />
      {!profile ? (
        <OnboardingInformation onComplete={setProfile} />
      ) : (
        <ForYouFeed user={profile} />
      )}
    </div>
  );
}
```

---

## Success Criteria

- [ ] New users see onboarding on first visit to `/`
- [ ] After onboarding, users see personalized feed
- [ ] Refreshing page preserves user profile (localStorage)
- [ ] NavBar shows Chat navigation
- [ ] `/contributor` is still accessible (unlisted)
- [ ] `/foryou` redirects or is removed
- [ ] No TypeScript errors
- [ ] Code follows existing patterns (Tailwind, component structure)

---

## Testing Strategy

### Manual Testing Checklist
1. **New User Flow:**
   - Open app in incognito → see onboarding
   - Complete onboarding → see feed
   - Refresh → still see feed (not onboarding)

2. **Returning User Flow:**
   - Open app normally → see feed (if previously onboarded)
   - Click "Reset" → see onboarding again

3. **Navigation:**
   - Click Chat in NavBar → goes to `/chat`
   - Click DubAI logo → stays on home (feed)

4. **Contributor Access:**
   - Navigate to `/contributor` directly → works
   - No public link to contributor page

### Future: Unit Tests
- `useLocalStorage` hook: get/set/clear operations
- `useUserProfile` hook: profile state management

---

## Learning Concepts Covered

| Concept | Where Applied |
|---------|---------------|
| **TypeScript Generics** | `useLocalStorage<T>` hook |
| **React Custom Hooks** | Both new hooks |
| **State Persistence** | localStorage integration |
| **SSR Hydration** | Handling server/client mismatch |
| **Conditional Rendering** | Onboarding vs Feed display |
| **Next.js Routing** | Link component, navigation |
| **Component Composition** | Building from existing components |
| **Single Responsibility** | Each hook does one thing |

---

## Notes for Multi-University Support

The current implementation defaults to `uw-seattle`. For future multi-tenant support:

1. **Organization Detection:** Could use subdomain (`uw.dubai.com`) or URL param
2. **Config System:** Already exists in `src/config/organizations.ts`
3. **Branding:** Organization has `branding` field for colors/logo
4. **Data Isolation:** `organizationId` exists on all content/profiles

This phase keeps the UW-Seattle default but preserves the architecture for expansion.

---

## Estimated Complexity

| Step | Complexity | New Code | Modifications |
|------|------------|----------|---------------|
| 1. localStorage hook | Medium | ~40 lines | None |
| 2. useUserProfile hook | Low | ~25 lines | None |
| 3. NavBar update | Low | ~10 lines | NavBar.tsx |
| 4. Homepage replacement | Medium | ~30 lines | page.tsx |
| 5. Cleanup | Low | Deletions | Links |

**Total:** ~105 lines of new code, moderate modifications
