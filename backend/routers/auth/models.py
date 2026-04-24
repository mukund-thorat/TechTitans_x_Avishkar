from typing import Optional

from pydantic import BaseModel, EmailStr

class SignUpModel(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: Optional[str] = None

class GoogleFinalizeModel(BaseModel):
    email: EmailStr
    avatar: Optional[str] = None

class UserCredentials(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginOTPVerificationModel(BaseModel):
    email: EmailStr
    otp: str

class UserResponseModel(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: EmailStr
    avatar: str



class UserProfileUpdateModel(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    avatar: Optional[str] = None
