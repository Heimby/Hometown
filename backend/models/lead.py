from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class LeadCreate(BaseModel):
    address: str
    name: str
    phone: str
    email: EmailStr

class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    address: str
    name: str
    phone: str
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")  # new, contacted, converted, rejected
    notes: Optional[str] = None
