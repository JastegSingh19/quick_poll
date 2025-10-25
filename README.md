# QuickPoll — Real-Time Opinion Polling Platform

A full‑stack prototype built fast with **FastAPI** (backend) and **Next.js + React + TypeScript + Tailwind + Framer Motion** (frontend).
Purple/pink neon theme, smooth animations, and live updates via WebSockets.

## Run locally (two terminals)
### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API: http://localhost:8000  (Docs: http://localhost:8000/docs)

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:3000

## System Design (quick overview)
- **Storage**: SQLite via SQLAlchemy (Poll, Option, Vote, Like). One‑vote‑per‑poll enforced by `user_key` uniqueness.
- **API**:
  - `POST /polls` create poll with options
  - `GET /polls` list polls
  - `GET /polls/{id}` fetch a poll
  - `POST /polls/{id}/vote` cast vote
  - `POST /polls/{id}/like` like a poll
- **Live updates**: FastAPI WebSocket `/ws` broadcasts events (`poll_created`, `vote`, `like`) to all clients.
- **Client**: Next.js app connects to the WebSocket and updates UI in real time. Animated bars show live percentages.

## Notes
- This is a clean, extensible baseline. You can add auth (JWT), pagination, and persistence constraints easily.
- For deployment: Render/Railway for FastAPI; Vercel/Netlify for Next.js. Set `NEXT_PUBLIC_API_BASE` to the deployed API URL.

