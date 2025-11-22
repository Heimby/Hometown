from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import uuid4

class Annotation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    type: str  # 'text', 'marker', 'line', 'rectangle'
    x: float  # X coordinate (percentage)
    y: float  # Y coordinate (percentage)
    text: Optional[str] = None
    width: Optional[float] = None
    height: Optional[float] = None
    color: Optional[str] = "#000000"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FloorPlanData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    
    image_url: Optional[str] = None
    comment: Optional[str] = None
    annotations: List[Annotation] = []
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class FloorPlanUpdate(BaseModel):
    comment: Optional[str] = None
    annotations: Optional[List[Annotation]] = None

class AnnotationCreate(BaseModel):
    type: str
    x: float
    y: float
    text: Optional[str] = None
    width: Optional[float] = None
    height: Optional[float] = None
    color: Optional[str] = "#000000"
