from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional

class NoteBase(BaseModel):
    title: str
    content: str
    tags: Optional[str] = None

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None

class NoteResponse(NoteBase):
    id: UUID
    userId: UUID
    createdAt: datetime

    class Config:
        from_attributes = True
