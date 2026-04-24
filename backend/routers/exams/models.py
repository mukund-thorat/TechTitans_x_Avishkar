from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional

class QuestionBase(BaseModel):
    text: str
    options: List[str]
    correctOption: int

class QuestionResponse(QuestionBase):
    id: UUID
    examId: UUID

class ExamBase(BaseModel):
    title: str
    description: str
    timeLimit: int
    totalPoints: int

class ExamResponse(ExamBase):
    id: UUID
    questions: Optional[List[QuestionResponse]] = None

    class Config:
        from_attributes = True
