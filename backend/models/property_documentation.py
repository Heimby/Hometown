from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import uuid4

class DocumentationImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    url: str
    caption: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentationFile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    url: str
    filename: str
    file_type: str  # pdf, doc, etc
    size: Optional[int] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class SecuritySystemItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str  # e.g., "Sikringsskap (Hoved)"
    category: str = "security_systems"
    
    # Basic info
    location: str
    system_type: str
    last_checked: Optional[str] = None
    installed_date: Optional[str] = None
    installer: Optional[str] = None
    
    # Rich content
    video_url: Optional[str] = None
    images: List[DocumentationImage] = []
    description: Optional[str] = None
    notes: Optional[str] = None
    
    # Documents
    documents: List[DocumentationFile] = []
    
    # Additional metadata
    additional_info: Optional[Dict[str, Any]] = {}
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PropertyDocumentation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    property_id: Optional[str] = None  # Link to specific property if owner has multiple
    
    # Categories
    security_systems: List[SecuritySystemItem] = []
    # Future categories can be added here
    # access_systems: List[AccessSystemItem] = []
    # electronics: List[ElectronicsItem] = []
    # furniture: List[FurnitureItem] = []
    # key_info: List[KeyInfoItem] = []
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SecuritySystemItemCreate(BaseModel):
    name: str
    location: str
    system_type: str
    last_checked: Optional[str] = None
    installed_date: Optional[str] = None
    installer: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    additional_info: Optional[Dict[str, Any]] = {}

class SecuritySystemItemUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    system_type: Optional[str] = None
    last_checked: Optional[str] = None
    installed_date: Optional[str] = None
    installer: Optional[str] = None
    video_url: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    additional_info: Optional[Dict[str, Any]] = None
