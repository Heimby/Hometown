from fastapi import APIRouter, HTTPException, UploadFile, File
from models.access_and_locks import (
    AccessAndLocksData,
    PrimaryAccessUpdate,
    BackupAccessUpdate,
    EmergencyProtocolUpdate,
    NavigationFromStreetUpdate,
    RoomWalkthroughUpdate,
    ParkingInfoUpdate,
    VideoData
)
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
from uuid import uuid4
import shutil
from pathlib import Path

router = APIRouter()

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'digihome')]

# File upload directory
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.get("/owners/{owner_id}/access-locks")
async def get_access_locks_data(owner_id: str):
    """
    Get access and locks data for an owner
    """
    try:
        # Check if owner exists
        owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})
        if not owner:
            raise HTTPException(status_code=404, detail="Owner not found")
        
        # Get or create access locks data
        data = await db.access_and_locks.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            # Create new data for owner
            new_data = AccessAndLocksData(owner_id=owner_id)
            await db.access_and_locks.insert_one(new_data.dict())
            return new_data.dict()
        
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch access locks data: {str(e)}")

@router.put("/owners/{owner_id}/access-locks/primary-access")
async def update_primary_access(owner_id: str, update_data: PrimaryAccessUpdate):
    """
    Update primary access information
    """
    try:
        # Get or create access locks data
        data = await db.access_and_locks.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            # Create new data
            new_data = AccessAndLocksData(owner_id=owner_id)
            data = new_data.dict()
        
        # Update primary_access fields
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            data["primary_access"][key] = value
        
        data["updated_at"] = datetime.utcnow()
        
        # Upsert document
        await db.access_and_locks.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return data["primary_access"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update primary access: {str(e)}")

@router.put("/owners/{owner_id}/access-locks/backup-access")
async def update_backup_access(owner_id: str, update_data: BackupAccessUpdate):
    """
    Update backup access information
    """
    try:
        data = await db.access_and_locks.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            new_data = AccessAndLocksData(owner_id=owner_id)
            data = new_data.dict()
        
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            data["backup_access"][key] = value
        
        data["updated_at"] = datetime.utcnow()
        
        await db.access_and_locks.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return data["backup_access"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update backup access: {str(e)}")

@router.put("/owners/{owner_id}/access-locks/emergency-protocol")
async def update_emergency_protocol(owner_id: str, update_data: EmergencyProtocolUpdate):
    """
    Update emergency protocol information
    """
    try:
        data = await db.access_and_locks.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            new_data = AccessAndLocksData(owner_id=owner_id)
            data = new_data.dict()
        
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            data["emergency_protocol"][key] = value
        
        data["updated_at"] = datetime.utcnow()
        
        await db.access_and_locks.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return data["emergency_protocol"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update emergency protocol: {str(e)}")

@router.put("/owners/{owner_id}/access-locks/navigation")
async def update_navigation(owner_id: str, update_data: NavigationFromStreetUpdate):
    """
    Update navigation from street information
    """
    try:
        data = await db.access_and_locks.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            new_data = AccessAndLocksData(owner_id=owner_id)
            data = new_data.dict()
        
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            data["navigation_from_street"][key] = value
        
        data["updated_at"] = datetime.utcnow()
        
        await db.access_and_locks.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return data["navigation_from_street"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update navigation: {str(e)}")

@router.put("/owners/{owner_id}/access-locks/room-walkthrough")
async def update_room_walkthrough(owner_id: str, update_data: RoomWalkthroughUpdate):
    """
    Update room walkthrough information
    """
    try:
        data = await db.access_and_locks.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            new_data = AccessAndLocksData(owner_id=owner_id)
            data = new_data.dict()
        
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            data["room_walkthrough"][key] = value
        
        data["updated_at"] = datetime.utcnow()
        
        await db.access_and_locks.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return data["room_walkthrough"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update room walkthrough: {str(e)}")

@router.put("/owners/{owner_id}/access-locks/parking")
async def update_parking_info(owner_id: str, update_data: ParkingInfoUpdate):
    """
    Update parking information
    """
    try:
        data = await db.access_and_locks.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            new_data = AccessAndLocksData(owner_id=owner_id)
            data = new_data.dict()
        
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            data["parking_info"][key] = value
        
        data["updated_at"] = datetime.utcnow()
        
        await db.access_and_locks.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return data["parking_info"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update parking info: {str(e)}")

@router.post("/owners/{owner_id}/access-locks/{category}/upload-video")
async def upload_video(owner_id: str, category: str, file: UploadFile = File(...)):
    """
    Upload a video for a specific category
    category can be: primary_access, navigation, room_walkthrough, parking
    """
    try:
        # Validate file type
        if not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Generate unique filename
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{uuid4()}.{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create video URL
        video_url = f"/uploads/{unique_filename}"
        
        # Create VideoData object
        video_data = VideoData(
            url=video_url,
            uploaded_at=datetime.utcnow()
        )
        
        # Update database
        data = await db.access_and_locks.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            new_data = AccessAndLocksData(owner_id=owner_id)
            data = new_data.dict()
        
        # Update the specific category's video
        if category in data:
            data[category]["video"] = video_data.dict()
        else:
            raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
        
        data["updated_at"] = datetime.utcnow()
        
        await db.access_and_locks.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return video_data.dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload video: {str(e)}")
