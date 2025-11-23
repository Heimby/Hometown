from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Partner(BaseModel):
    id: str
    owner_id: str
    category: str  # daglig-drift, profesjonelle, vedlikehold, spesialiserte
    name: str
    service: str
    phone: str
    email: str
    additional_info: Optional[str] = None
    notes: Optional[str] = None
    is_certified: bool = False  # DigiHome certified partner
    status: str = "Aktiv"  # Aktiv, Inaktiv
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class PartnerCreate(BaseModel):
    category: str
    name: str
    service: str
    phone: str
    email: str
    additional_info: Optional[str] = None
    notes: Optional[str] = None
    is_certified: bool = False
    status: str = "Aktiv"

class PartnerUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    service: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    additional_info: Optional[str] = None
    notes: Optional[str] = None
    is_certified: Optional[bool] = None
    status: Optional[str] = None
