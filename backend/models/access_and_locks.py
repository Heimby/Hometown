from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import uuid4

class VideoData(BaseModel):
    url: Optional[str] = None
    duration: Optional[str] = None
    uploaded_at: Optional[datetime] = None

class PrimaryAccess(BaseModel):
    system_type: Optional[str] = None  # e.g., "Smartlås (Yale Doorman V2N)"
    access_method: Optional[str] = None  # e.g., "PIN-kode eller nøkkel"
    location: Optional[str] = None  # e.g., "Hovedinngangsdør, 3. etg"
    pin_code: Optional[str] = None
    battery_type: Optional[str] = None
    battery_changed: Optional[str] = None
    bluetooth_enabled: bool = False
    lock_type: Optional[str] = None
    description: Optional[str] = None
    video: Optional[VideoData] = None

class BackupAccess(BaseModel):
    key_type: Optional[str] = None  # e.g., "Fysisk nøkkel"
    key_location: Optional[str] = None  # e.g., "Safe hos nabo (Leil. 302)"
    contact_person: Optional[str] = None  # e.g., "Anne Hansen"
    contact_phone: Optional[str] = None  # e.g., "987 65 432"
    availability: Optional[str] = None  # e.g., "24/7"
    safe_code: Optional[str] = None
    description: Optional[str] = None

class EmergencyContact(BaseModel):
    name: str
    phone: str
    role: str
    response_time: Optional[str] = None

class EmergencyProtocol(BaseModel):
    primary_contact: Optional[EmergencyContact] = None
    secondary_contact: Optional[EmergencyContact] = None
    locksmith_contact: Optional[EmergencyContact] = None
    description: Optional[str] = None

class NavigationFromStreet(BaseModel):
    start_point: Optional[str] = None
    description: Optional[str] = None
    door_code: Optional[str] = None
    mailbox_number: Optional[str] = None
    floor: Optional[str] = None
    video: Optional[VideoData] = None

class RoomWalkthrough(BaseModel):
    rooms_documented: Optional[str] = None  # e.g., "7 rom (komplett)"
    description: Optional[str] = None
    video: Optional[VideoData] = None

class ParkingInfo(BaseModel):
    garage_spot: Optional[str] = None  # e.g., "P-kjeller, plass #24"
    street_parking: Optional[str] = None
    garage_code: Optional[str] = None
    description: Optional[str] = None
    video: Optional[VideoData] = None

class AccessAndLocksData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    
    primary_access: PrimaryAccess = PrimaryAccess()
    backup_access: BackupAccess = BackupAccess()
    emergency_protocol: EmergencyProtocol = EmergencyProtocol()
    navigation_from_street: NavigationFromStreet = NavigationFromStreet()
    room_walkthrough: RoomWalkthrough = RoomWalkthrough()
    parking_info: ParkingInfo = ParkingInfo()
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Update models
class PrimaryAccessUpdate(BaseModel):
    system_type: Optional[str] = None
    access_method: Optional[str] = None
    location: Optional[str] = None
    pin_code: Optional[str] = None
    battery_type: Optional[str] = None
    battery_changed: Optional[str] = None
    bluetooth_enabled: Optional[bool] = None
    lock_type: Optional[str] = None
    description: Optional[str] = None

class BackupAccessUpdate(BaseModel):
    key_type: Optional[str] = None
    key_location: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    availability: Optional[str] = None
    safe_code: Optional[str] = None
    description: Optional[str] = None

class EmergencyProtocolUpdate(BaseModel):
    primary_contact: Optional[EmergencyContact] = None
    secondary_contact: Optional[EmergencyContact] = None
    locksmith_contact: Optional[EmergencyContact] = None
    description: Optional[str] = None

class NavigationFromStreetUpdate(BaseModel):
    start_point: Optional[str] = None
    description: Optional[str] = None
    door_code: Optional[str] = None
    mailbox_number: Optional[str] = None
    floor: Optional[str] = None

class RoomWalkthroughUpdate(BaseModel):
    rooms_documented: Optional[str] = None
    description: Optional[str] = None

class ParkingInfoUpdate(BaseModel):
    garage_spot: Optional[str] = None
    street_parking: Optional[str] = None
    garage_code: Optional[str] = None
    description: Optional[str] = None
