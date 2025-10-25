# QuickPoll Backend (FastAPI)

## Run locally
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
The API will be at `http://localhost:8000`, docs at `/docs`.

## Env
Copy `.env.example` to `.env` to override defaults.
