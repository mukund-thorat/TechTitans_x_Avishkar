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


class PendingUser(Base):
    __tablename__ = "pending_users"

    id:                 Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    firstName:          Mapped[str] = mapped_column(String, nullable=False)
    lastName:           Mapped[str] = mapped_column(String, nullable=False)
    email:              Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    passwordHash:       Mapped[str] = mapped_column(String, nullable=True)
    authServiceProvider:Mapped[AuthServiceProvider] = mapped_column(SqlEnum(AuthServiceProvider), nullable=False)
