from sqlalchemy import Column, Integer, String, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base

class Poll(Base):
    __tablename__ = "polls"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    author = Column(String(100), nullable=True)
    likes = Column(Integer, default=0)
    options = relationship("Option", back_populates="poll", cascade="all, delete-orphan")

class Option(Base):
    __tablename__ = "options"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255), nullable=False)
    votes = Column(Integer, default=0)
    poll_id = Column(Integer, ForeignKey("polls.id", ondelete="CASCADE"), index=True, nullable=False)
    poll = relationship("Poll", back_populates="options")

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, index=True, nullable=False)
    option_id = Column(Integer, index=True, nullable=False)
    user_key = Column(String(128), nullable=True)
    __table_args__ = (UniqueConstraint('poll_id', 'user_key', name='uq_poll_user'),)

class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, index=True, nullable=False)
    user_key = Column(String(128), nullable=True)
    __table_args__ = (UniqueConstraint('poll_id', 'user_key', name='uq_like_poll_user'),)
