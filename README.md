# DubAI

AI-powered personalized platform for university students. One intelligent system that knows everything about campus.

> Multi-tenant architecture supporting multiple universities

## Overview

DubAI transforms the university experience by providing personalized recommendations for events, clubs, and resources. Built with a multi-tenant architecture (similar to Canvas), the platform can serve multiple universities while maintaining unique branding and content for each institution.

## Core Features

- **Personalized "For You" Feed** - AI-powered event and club recommendations
- **Chat Assistant** - Campus information and navigation
- **Multi-University Support** - Scalable tenant-based architecture
- **Smart Matching** - Tag-based algorithm matching user interests to content

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI
- **AI**: Anthropic API / OpenAI
- **Database**: Supabase
- **Scraper**: Scrapy (for data collection)

---

## Architecture

### Multi-Tenant Design

DubAI uses a tenant-based architecture where each university is an **Organization**:

```typescript
interface Organization {
  id: string;                    // e.g., "uw-seattle"
  name: string;                  // "University of Washington"
  domains: string[];             // ["uw.edu", "washington.edu"]
  branding: { primaryColor: string };
  onboardingConfig: {
    majors: string[];            // School-specific majors
    campuses: string[];          // ["Seattle", "Tacoma", "Bothell"]
  };
}
```

### Universal Tagging System

Content and users are matched through tags rather than hardcoded logic:

- **Topic Tags**: Tech, Art, Sports, Music
- **Identity Tags**: Freshman, Transfer, International, Commuter
- **Career Tags**: Internships, Research, Networking
- **Major/Department**: Dynamic based on organization

### Data Models

**User Profile:**
```typescript
interface User {
  id: string;
  organizationId: string;        // Links user to their university
  tags: string[];                // ["tech", "freshman", "informatics"]
}
```

**Content (Events/Clubs):**
```typescript
interface ContentItem {
  id: string;
  organizationId: string;        // Belongs to specific university
  type: "event" | "club" | "announcement";
  title: string;
  description: string;
  tags: string[];                // ["tech", "career", "networking"]
  date?: Date;
}
```

### Recommendation Algorithm

**Matchmaker v1** (Deterministic):
1. Fetch content for user's organization
2. Filter valid items (future events)
3. Score each item:
   - +10 points: Major match
   - +5 points: Interest tag match
   - +2 points: Identity match
4. Sort by score, display top 20

**Future (Phase 3)**: Embedding-based RAG for fuzzy matching

---

## Project Structure

```
DubAI/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/# React components
│   │   ├── config/    # Organization configurations
│   │   ├── hooks/     # Custom React hooks
│   │   └── types/     # TypeScript definitions
│   └── public/        # Static assets
│
├── backend/           # Python backend
│   ├── src/
│   │   ├── api/       # FastAPI route handlers
│   │   ├── services/  # Business logic
│   │   └── models/    # Data models
│   ├── crawler/       # Scrapy web scraper
│   │   ├── scrapers/  # Spider implementations
│   │   └── scrapy.cfg # Scrapy configuration
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

See [frontend/README.md](frontend/README.md) for detailed frontend documentation.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

API will be available at [http://localhost:8000](http://localhost:8000).

### Web Scraper

```bash
cd backend
source venv/bin/activate
cd crawler
scrapy crawl uw
```

See [backend/crawler/README.md](backend/crawler/README.md) for detailed scraper documentation.

---

## User Flow

### 1. Dynamic Onboarding

1. User signs up with university email (e.g., `isaiah@uw.edu`)
2. System detects domain → assigns organization (`uw-seattle`)
3. Loads organization-specific configuration
4. Presents customized questionnaire:
   - Major selection (from org's major list)
   - Interest selection (universal + org-specific)
   - Year/identity questions
5. Creates user profile with selected tags

### 2. Personalized Feed

- Content is filtered by user's organization
- Scored using the Matchmaker algorithm
- Displayed in an engaging, visual feed
- Updates as user interacts and refines preferences

---

## Development Roadmap

### Phase 1: Config-Based (Current)
- ✅ Multi-tenant organization config
- ✅ Tag-based matching algorithm
- ✅ Dynamic onboarding
- ✅ For You feed UI
- 🔄 Scrapy data collection

### Phase 2: Database Integration
- Store organizations and content in Supabase
- Real-time data updates
- User authentication
- Social features (bookmarks, RSVP)

### Phase 3: AI Enhancement
- Embedding-based recommendations (RAG)
- Natural language event search
- AI-generated event summaries
- Predictive user interest modeling

---

## Contributing

This is a private repository. For questions or access, contact the development team.

---

*Built with [Next.js](https://nextjs.org), [FastAPI](https://fastapi.tiangolo.com), and [Tailwind CSS](https://tailwindcss.com)*
