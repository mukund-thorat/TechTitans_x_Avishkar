from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from data.core import get_db
from utils.security.tokens import get_current_user
from utils.models.pydantic_cm import UserModel
from routers.notes.models import NoteCreate, NoteResponse, NoteUpdate
from routers.notes import repo
from uuid import UUID
from fastapi import HTTPException
from utils.ai import generate_summary
from typing import List

router = APIRouter(prefix="/notes", tags=["notes"])

class GenerateRequest(BaseModel):
    url: str

@router.post("/generate", response_model=NoteResponse)
async def generate_note(
    payload: GenerateRequest,
    user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    import re
    regExp = r"^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*"
    match = re.match(regExp, payload.url)
    if not (match and len(match.group(2)) == 11):
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    
    video_id = match.group(2)
    title, summary = await generate_summary(video_id)
    
    note_create = NoteCreate(title=title, content=summary, tags=f"AI Summary,yt_id:{video_id}")
    return await repo.create_note(userId=user.id, note_data=note_create, db=db)

@router.post("/", response_model=NoteResponse)
async def create_note(
    payload: NoteCreate,
    user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await repo.create_note(userId=user.id, note_data=payload, db=db)

@router.get("/", response_model=List[NoteResponse])
async def get_notes(
    user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await repo.get_user_notes(userId=user.id, db=db)

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: UUID,
    user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    note = await repo.get_note_by_id(noteId=note_id, userId=user.id, db=db)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.patch("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: UUID,
    payload: NoteUpdate,
    user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    note = await repo.update_note(noteId=note_id, userId=user.id, note_data=payload, db=db)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.delete("/{note_id}")
async def delete_note(
    note_id: UUID,
    user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    success = await repo.delete_note(noteId=note_id, userId=user.id, db=db)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}
