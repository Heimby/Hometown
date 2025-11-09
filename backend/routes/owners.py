from fastapi import APIRouter, HTTPException
from models.owner import Owner, OwnerCreate, OwnerResponse
from motor.motor_asyncio import AsyncIOMotorClient
import os
from passlib.hash import bcrypt
from datetime import datetime

router = APIRouter()

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'digihome')]

@router.post("/owner-portal", response_model=OwnerResponse)
async def create_owner_portal(owner_data: OwnerCreate):
    """
    Create owner portal account
    This is step 2 of onboarding after lead submission
    """
    try:
        # Check if owner with this email already exists
        existing_owner = await db.owners.find_one({"email": owner_data.email})
        if existing_owner:
            raise HTTPException(status_code=400, detail="Owner portal already exists for this email")
        
        # Hash the password
        password_hash = bcrypt.hash(owner_data.password)
        
        # Create owner object
        owner_dict = owner_data.dict()
        owner_dict.pop('password')  # Remove plain password
        owner_dict['password_hash'] = password_hash
        
        owner = Owner(**owner_dict)
        
        # Find corresponding lead and link it
        lead = await db.leads.find_one({"email": owner_data.email})
        if lead:
            owner.lead_id = lead.get('id')
            # Update lead status
            await db.leads.update_one(
                {"email": owner_data.email},
                {"$set": {"status": "converted"}}
            )
        
        # Insert owner into database
        await db.owners.insert_one(owner.dict())
        
        # TODO: Send welcome email to owner
        # send_welcome_email(owner)
        
        # Return owner response (without password hash)
        return OwnerResponse(
            id=owner.id,
            name=owner.name,
            email=owner.email,
            address=owner.address,
            created_at=owner.created_at,
            is_active=owner.is_active
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create owner portal: {str(e)}")

@router.get("/owners")
async def get_all_owners(skip: int = 0, limit: int = 100):
    """
    Get all owners (for admin dashboard)
    """
    try:
        owners = await db.owners.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
        # Remove password hashes from response
        for owner in owners:
            owner.pop('password_hash', None)
        return owners
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch owners: {str(e)}")

@router.get("/owners/{owner_id}")
async def get_owner(owner_id: str):
    """
    Get a specific owner by ID
    """
    try:
        owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})
        if not owner:
            raise HTTPException(status_code=404, detail="Owner not found")
        owner.pop('password_hash', None)
        return owner
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch owner: {str(e)}")
