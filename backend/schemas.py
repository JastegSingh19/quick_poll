from pydantic import BaseModel, Field
from typing import List, Optional

class OptionCreate(BaseModel):
    text: str = Field(min_length=1, max_length=255)

class PollCreate(BaseModel):
    question: str = Field(min_length=3)
    options: List[OptionCreate]
    author: Optional[str] = None

class OptionOut(BaseModel):
    id: int
    text: str
    votes: int
    class Config:
        from_attributes = True

class PollOut(BaseModel):
    id: int
    question: str
    author: Optional[str] = None
    likes: int
    options: List[OptionOut]
    class Config:
        from_attributes = True

class VoteIn(BaseModel):
    option_id: int
    user_key: str

class LikeIn(BaseModel):
    user_key: str
