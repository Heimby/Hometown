from fastapi import APIRouter, HTTPException
from models.lead import Lead, LeadCreate
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime

router = APIRouter()

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'digihome')]

@router.post("/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate):
    """
    Create a new lead from the property owner form
    This triggers when user fills address, name, phone, email
    """
    try:
        # Create lead object
        lead = Lead(**lead_data.dict())
        
        # Check if lead with this email already exists
        existing_lead = await db.leads.find_one({"email": lead.email}, {"_id": 0})
        if existing_lead:
            # Update existing lead
            await db.leads.update_one(
                {"email": lead.email},
                {"$set": lead.dict()}
            )
        else:
            # Insert new lead
            await db.leads.insert_one(lead.dict())
        
        # TODO: Send email notification to admin
        # send_admin_notification(lead)
        
        return lead
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create lead: {str(e)}")

@router.get("/leads")
async def get_all_leads(skip: int = 0, limit: int = 100):
    """
    Get all leads (for admin dashboard)
    """
    try:
        leads = await db.leads.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
        return leads
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leads: {str(e)}")

@router.get("/leads/{lead_id}")
async def get_lead(lead_id: str):
    """
    Get a specific lead by ID
    """
    try:
        lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        return lead
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch lead: {str(e)}")
