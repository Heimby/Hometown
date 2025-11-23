from fastapi import APIRouter, HTTPException
from typing import List
from uuid import uuid4
from datetime import datetime, timezone
from models.partner import Partner, PartnerCreate, PartnerUpdate
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter()

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'digihome')]

@router.get("/api/partners/{owner_id}", response_model=List[Partner])
async def get_partners(owner_id: str):
    """Get all partners for an owner"""
    try:
        partners = await db.partners.find({"owner_id": owner_id}, {"_id": 0}).to_list(1000)
        return partners
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/partners/{owner_id}", response_model=Partner)
async def create_partner(owner_id: str, partner: PartnerCreate):
    """Create a new partner"""
    try:
        partner_dict = partner.dict()
        partner_dict["id"] = str(uuid4())
        partner_dict["owner_id"] = owner_id
        partner_dict["created_at"] = datetime.utcnow().isoformat()
        partner_dict["updated_at"] = datetime.utcnow().isoformat()
        
        await db.partners.insert_one(partner_dict)
        return partner_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/partners/{owner_id}/{partner_id}", response_model=Partner)
async def update_partner(owner_id: str, partner_id: str, partner_update: PartnerUpdate):
    """Update a partner"""
    try:
        update_data = {k: v for k, v in partner_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        result = await db.partners.find_one_and_update(
            {"id": partner_id, "owner_id": owner_id},
            {"$set": update_data},
            return_document=True,
            projection={"_id": 0}
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="Partner not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/partners/{owner_id}/{partner_id}")
async def delete_partner(owner_id: str, partner_id: str):
    """Delete a partner"""
    try:
        result = await db.partners.delete_one({"id": partner_id, "owner_id": owner_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Partner not found")
        
        return {"message": "Partner deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
