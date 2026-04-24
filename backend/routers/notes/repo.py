from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from data.schemas import Note
from routers.notes.models import NoteCreate, NoteUpdate
from uuid import UUID

async def create_note(userId: UUID, note_data: NoteCreate, db: AsyncSession):
    new_note = Note(
        userId=userId,
        title=note_data.title,
        content=note_data.content,
        tags=note_data.tags
    )
    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    return new_note

async def get_user_notes(userId: UUID, db: AsyncSession):
    result = await db.execute(select(Note).where(Note.userId == userId).order_by(Note.createdAt.desc()))
    return result.scalars().all()

async def get_note_by_id(noteId: UUID, userId: UUID, db: AsyncSession):
    result = await db.execute(select(Note).where(Note.id == noteId, Note.userId == userId))
    return result.scalars().first()

async def update_note(noteId: UUID, userId: UUID, note_data: NoteUpdate, db: AsyncSession):
    note = await get_note_by_id(noteId, userId, db)
    if not note:
        return None
    
    update_data = note_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(note, key, value)
        
    await db.commit()
    await db.refresh(note)
    return note

async def delete_note(noteId: UUID, userId: UUID, db: AsyncSession):
    note = await get_note_by_id(noteId, userId, db)
    if not note:
        return False
    
    await db.delete(note)
    await db.commit()
    return True
