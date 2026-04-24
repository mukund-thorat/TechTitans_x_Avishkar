from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from data.core import get_db
from data.schemas import User
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/stats", tags=["stats"])

class LeaderboardUser(BaseModel):
    id: str
    firstName: str
    lastName: str
    avatar: str
    points: int

@router.get("/leaderboard", response_model=List[LeaderboardUser])
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).order_by(desc(User.points)).limit(10)
    )
    users = result.scalars().all()
    return [
        LeaderboardUser(
            id=str(user.id),
            firstName=user.firstName,
            lastName=user.lastName,
            avatar=user.avatar,
            points=user.points
        ) for user in users
    ]
