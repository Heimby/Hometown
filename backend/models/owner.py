from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
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
    onboarding_completed: bool = Field(default=False)
    onboarding_data: Optional[Dict[str, Any]] = None
    status: str = Field(default="Ringt")  # "Ringt", "Sendt tilbud", "Onboarding", "Kontrakt", "Lost"

class OwnerResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    address: str
    created_at: datetime
    is_active: bool
    onboarding_completed: bool = False
    onboarding_data: Optional[Dict[str, Any]] = None

class OnboardingData(BaseModel):
    # Step 1: Address
    address: str
    city: str
    unit: Optional[str] = None
    property_type: str  # "apartment" or "house"
    ownership_type: str  # "selveier" or "borettslag"
    
    # Step 2: Strategy
    rental_strategy: str  # "short", "long", or "dynamic"
    start_date: str
    end_date: Optional[str] = None
    
    # Step 3: Details
    rooms: Dict[str, Any]  # {living: [], bedroom: [], bathroom: []}
    
    # Step 4: Facilities
    facilities: list  # ["balkong", "tørketrommel", "heis"]
    parking: str  # "none", "free", "garage"
    
    # Step 5: Presentation
    photography: str  # "professional" or "upload"
    cleaning: str  # "self" or "service"
