from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class OwnerCreate(BaseModel):
    address: str
    name: str
    phone: str
    email: EmailStr
    password: str

class Owner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: Optional[str] = None
    address: str
    name: str
    phone: str
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
    properties: list = Field(default_factory=list)

class OwnerResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    address: str
    created_at: datetime
    is_active: bool
