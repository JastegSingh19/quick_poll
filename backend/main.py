from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
import models, schemas
from websocket_manager import manager

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QuickPoll API", version="1.0.0")

# CORS for local Next.js dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/polls", response_model=schemas.PollOut)
def create_poll(payload: schemas.PollCreate, db: Session = Depends(get_db)):
    if not payload.options or len(payload.options) < 2:
        raise HTTPException(status_code=400, detail="At least two options required")
    poll = models.Poll(question=payload.question.strip(), author=payload.author or None)
    for opt in payload.options:
        poll.options.append(models.Option(text=opt.text.strip()))
    db.add(poll)
    db.commit()
    db.refresh(poll)
    # Broadcast
    data = {
        "type": "poll_created",
        "poll": {
            "id": poll.id,
            "question": poll.question,
            "author": poll.author,
            "likes": poll.likes,
            "options": [{"id": o.id, "text": o.text, "votes": o.votes} for o in poll.options],
        }
    }
    import anyio
    anyio.from_thread.run(manager.broadcast_json, data)
    return poll

@app.get("/polls", response_model=list[schemas.PollOut])
def list_polls(db: Session = Depends(get_db)):
    return db.query(models.Poll).all()

@app.get("/polls/{poll_id}", response_model=schemas.PollOut)
def get_poll(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    return poll

@app.post("/polls/{poll_id}/vote")
def vote(poll_id: int, payload: schemas.VoteIn, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    option = db.query(models.Option).filter(models.Option.id == payload.option_id, models.Option.poll_id == poll_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")

    # Enforce 1 vote per poll per user_key (best-effort)
    if payload.user_key:
        existing = db.query(models.Vote).filter(models.Vote.poll_id == poll_id, models.Vote.user_key == payload.user_key).first()
        if existing:
            raise HTTPException(status_code=409, detail="User already voted on this poll")

    option.votes += 1
    v = models.Vote(poll_id=poll_id, option_id=payload.option_id, user_key=payload.user_key or None)
    db.add(v)
    db.commit()
    db.refresh(option)

    data = {
        "type": "vote",
        "poll_id": poll_id,
        "option_id": payload.option_id,
        "votes": option.votes
    }
    import anyio
    anyio.from_thread.run(manager.broadcast_json, data)
    return {"ok": True}

@app.post("/polls/{poll_id}/like")
def like(poll_id: int, payload: schemas.LikeIn, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    if payload.user_key:
        existing = db.query(models.Like).filter(models.Like.poll_id == poll_id, models.Like.user_key == payload.user_key).first()
        if existing:
            raise HTTPException(status_code=409, detail="User already liked this poll")

    poll.likes += 1
    like = models.Like(poll_id=poll_id, user_key=payload.user_key or None)
    db.add(like)
    db.commit()
    db.refresh(poll)

    data = {"type": "like", "poll_id": poll_id, "likes": poll.likes}
    import anyio
    anyio.from_thread.run(manager.broadcast_json, data)
    return {"ok": True}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            # We don't require incoming messages for now; keep alive
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)
