# DubAI System Architecture: Multi-Tenant "For You" Engine

## 1. Overview

This document outlines the architectural strategy for transforming DubAI from a UW-specific tool into a scalable, multi-tenant platform (similar to Canvas). The core goal is to decouple the "Engine" (the logic for recommendations, chat, and events) from the "Content" (specific to a university or organization).

## 2. Core Concepts

### 2.1 The "Tenant" (Organization)

Instead of hardcoding "UW" logic, we treat every school as a **Tenant**.

- **Definition**: An entity that owns a specific instance of the experience.
- **Role**: Defines the branding, the valid email domains (e.g., `@uw.edu`), and the specific categories of interest (e.g., "Informatics" vs "Computer Science").

### 2.2 The Universal Tagging System

To make recommendations work across different schools without rewriting code, we use a universal tagging system.

- **Concept**: Users have Tags. Content (Events/Clubs) has Tags. The system simply matches them.
- **Tag Types**:
  - `Topic`: Tech, Art, Sports, Music.
  - `Identity`: Freshman, Transfer, International, Commuter.
  - `Career`: Internships, Research, Networking.
  - `Major/Department`: (Dynamic based on Tenant).

---

## 3. Data Models (Conceptual)

### Organization (Tenant)

```typescript
interface Organization {
  id: string; // e.g., "uw-seattle"
  name: string; // "University of Washington"
  domains: string[]; // ["uw.edu", "washington.edu"]
  branding: {
    primaryColor: string; // "#4b2e83"
  };
  // Configuration for onboarding questions
  onboardingConfig: {
    majors: string[]; // List of majors specific to this school
    campuses: string[]; // ["Seattle", "Tacoma", "Bothell"]
  };
}
```

### User Profile

```typescript
interface User {
  id: string;
  organizationId: string; // Links user to UW
  tags: string[]; // ["tech", "freshman", "informatics"]
  // ... auth details
}
```

### Content (Event / RSO)

```typescript
interface ContentItem {
  id: string;
  organizationId: string; // Belongs to UW
  type: "event" | "club" | "announcement";
  title: string;
  description: string;
  tags: string[]; // ["tech", "career", "networking"]
  date?: Date;
}
```

---

## 4. User Flows

### 4.1 Dynamic Onboarding

The onboarding process adapts based on the user's organization.

1.  **Detection**: User signs up with `isaiah@uw.edu`. System detects `@uw.edu` -> Assigns Organization: `uw-seattle`.
2.  **Configuration Load**: System loads the `onboardingConfig` for UW.
3.  **Questionnaire**:
    - "What is your major?" -> Dropdown populated by `uw.majors`.
    - "What are your interests?" -> Universal list (Tech, Art) + Org specific list.
4.  **Profile Creation**: User profile is saved with selected Tags.

### 4.2 The "For You" Algorithm (Matchmaker v1)

A simple, deterministic algorithm to start.

**Logic:**

1.  Fetch all `ContentItems` where `organizationId` == `user.organizationId`.
2.  Filter items that are valid (future dates for events).
3.  **Score** each item:
    - +10 points for exact Major match.
    - +5 points for Interest tag match (e.g., User likes "Tech", Event is "Tech").
    - +2 points for Identity match (e.g., "Freshman").
4.  **Sort** by Score (Descending).
5.  **Display** top 20 items.

---

## 5. Technical Strategy

### Phase 1: Config-Based (Current Step)

- Store Organization data in a static JSON/Config file (`src/config/organizations.ts`).
- Mock the Database with local arrays.
- Build the UI to read from this config.

### Phase 2: Database Integration

- Move models to a real database (Postgres/Prisma).
- Implement the Scraper to populate the `ContentItem` table.

### Phase 3: AI Enhancement

- Replace the simple "Score" algorithm with an Embedding-based search (RAG) for "fuzzy" matching (e.g., matching "Coding" tag to "Hackathon" event even if tags aren't identical).
