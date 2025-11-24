# DubAI

AI for UW students. One intelligent system that knows everything about campus.

> Private repo - proprietary data integrations

## Features

- Campus information and navigation
- Course recommendations and planning
- Dining hall menus and hours

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI
- **AI**: Anthropic API / OpenAI
- **Database**: Supabase

---

## Project Structure

```
DubAI/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   └── components/# React components
│   └── public/        # Static assets
│
├── backend/           # Python FastAPI backend
│   ├── src/
│   │   ├── api/       # API route handlers
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

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

API will be available at [http://localhost:8000](http://localhost:8000).

### Web Scraper (Crawler)

The crawler uses Scrapy to scrape UW websites for RAG context.

```bash
cd backend
source venv/bin/activate
cd crawler
scrapy crawl uw  # Run the UW spider
```

See [backend/crawler/README.md](backend/crawler/README.md) for detailed usage.

---

*Built with [Next.js](https://nextjs.org), [FastAPI](https://fastapi.tiangolo.com), and [Tailwind CSS](https://tailwindcss.com)*
