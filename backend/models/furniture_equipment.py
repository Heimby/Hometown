from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import uuid4

class FurnitureItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    quantity: str
    comment: Optional[str] = None
    category: str  # 'kitchen', 'tableware', 'household', 'other'
    checked: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FurnitureEquipmentData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    
    general_comments: Optional[str] = None
    items: List[FurnitureItem] = []
    last_confirmed: Optional[datetime] = None
    confirmed_by: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class FurnitureItemCreate(BaseModel):
    name: str
    quantity: str
    comment: Optional[str] = None
    category: str = "other"

class FurnitureItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[str] = None
    comment: Optional[str] = None
    checked: Optional[bool] = None

class FurnitureEquipmentUpdate(BaseModel):
    general_comments: Optional[str] = None
    last_confirmed: Optional[datetime] = None
    confirmed_by: Optional[str] = None
