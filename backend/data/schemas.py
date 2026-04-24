import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql.base import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Enum as SqlEnum

from data.core import Base


class AuthServiceProvider(str, Enum):
    GOOGLE = "google"
    APP = "app"


class User(Base):
    __tablename__ = "users"

    id:                 Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    firstName:          Mapped[str] = mapped_column(String, nullable=False)
    lastName:           Mapped[str] = mapped_column(String, nullable=False)
    email:              Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    passwordHash:       Mapped[str] = mapped_column(String, nullable=True)
    authServiceProvider:Mapped[AuthServiceProvider] = mapped_column(SqlEnum(AuthServiceProvider), nullable=False)
    avatar:             Mapped[str] = mapped_column(String, nullable=False)
    refreshToken:       Mapped[Optional[str]] = mapped_column(String, nullable=True)
    createdAt:          Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    deletedAt:          Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    lastLogIn:          Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    points:             Mapped[int] = mapped_column(nullable=False, default=0)



class PendingUser(Base):
    __tablename__ = "pending_users"

    id:                 Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    firstName:          Mapped[str] = mapped_column(String, nullable=False)
    lastName:           Mapped[str] = mapped_column(String, nullable=False)
    email:              Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    passwordHash:       Mapped[str] = mapped_column(String, nullable=True)
    authServiceProvider:Mapped[AuthServiceProvider] = mapped_column(SqlEnum(AuthServiceProvider), nullable=False)

class Note(Base):
    __tablename__ = "notes"

    id:                 Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId:             Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    title:              Mapped[str] = mapped_column(String, nullable=False)
    content:            Mapped[str] = mapped_column(String, nullable=False)
    tags:               Mapped[Optional[str]] = mapped_column(String, nullable=True)
    createdAt:          Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.now)

class Exam(Base):
    __tablename__ = "exams"

    id:                 Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title:              Mapped[str] = mapped_column(String, nullable=False)
    description:        Mapped[str] = mapped_column(String, nullable=False)
    timeLimit:          Mapped[int] = mapped_column(nullable=False) # In minutes
    totalPoints:        Mapped[int] = mapped_column(nullable=False)

class Question(Base):
    __tablename__ = "questions"

    id:                 Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    examId:             Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    text:               Mapped[str] = mapped_column(String, nullable=False)
    options:            Mapped[str] = mapped_column(String, nullable=False) # JSON string of options
    correctOption:      Mapped[int] = mapped_column(nullable=False) # Index of correct option


