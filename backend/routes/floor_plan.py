from fastapi import APIRouter, HTTPException, UploadFile, File
from models.floor_plan import (
    FloorPlanData,
    FloorPlanUpdate,
    AnnotationCreate,
    Annotation
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

@router.get("/owners/{owner_id}/floor-plan")
async def get_floor_plan(owner_id: str):
    """
    Get floor plan data for an owner
    """
    try:
        # Check if owner exists
        owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})
        if not owner:
            raise HTTPException(status_code=404, detail="Owner not found")
        
        # Get or create floor plan data
        data = await db.floor_plans.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            # Create new floor plan data for owner
            new_data = FloorPlanData(owner_id=owner_id)
            await db.floor_plans.insert_one(new_data.dict())
            return new_data.dict()
        
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch floor plan: {str(e)}")

@router.put("/owners/{owner_id}/floor-plan")
async def update_floor_plan(owner_id: str, update_data: FloorPlanUpdate):
    """
    Update floor plan comment and annotations
    """
    try:
        data = await db.floor_plans.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            # Create new data
            new_data = FloorPlanData(owner_id=owner_id)
            data = new_data.dict()
        
        # Update fields
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            data[key] = value
        
        data["updated_at"] = datetime.utcnow()
        
        # Upsert document
        await db.floor_plans.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update floor plan: {str(e)}")

@router.post("/owners/{owner_id}/floor-plan/upload-image")
async def upload_floor_plan_image(owner_id: str, file: UploadFile = File(...)):
    """
    Upload floor plan image
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"floor_plan_{uuid4()}.{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create image URL
        image_url = f"/uploads/{unique_filename}"
        
        # Update database
        data = await db.floor_plans.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            new_data = FloorPlanData(owner_id=owner_id)
            data = new_data.dict()
        
        data["image_url"] = image_url
        data["updated_at"] = datetime.utcnow()
        
        await db.floor_plans.update_one(
            {"owner_id": owner_id},
            {"$set": data},
            upsert=True
        )
        
        return {"image_url": image_url}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload floor plan image: {str(e)}")

@router.post("/owners/{owner_id}/floor-plan/annotations")
async def add_annotation(owner_id: str, annotation: AnnotationCreate):
    """
    Add an annotation to the floor plan
    """
    try:
        data = await db.floor_plans.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            raise HTTPException(status_code=404, detail="Floor plan not found")
        
        # Create new annotation
        new_annotation = Annotation(**annotation.dict())
        
        if "annotations" not in data:
            data["annotations"] = []
        
        data["annotations"].append(new_annotation.dict())
        data["updated_at"] = datetime.utcnow()
        
        await db.floor_plans.update_one(
            {"owner_id": owner_id},
            {"$set": data}
        )
        
        return new_annotation.dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add annotation: {str(e)}")

@router.delete("/owners/{owner_id}/floor-plan/annotations/{annotation_id}")
async def delete_annotation(owner_id: str, annotation_id: str):
    """
    Delete an annotation from the floor plan
    """
    try:
        data = await db.floor_plans.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            raise HTTPException(status_code=404, detail="Floor plan not found")
        
        # Remove annotation
        annotations = data.get("annotations", [])
        annotations = [ann for ann in annotations if ann["id"] != annotation_id]
        data["annotations"] = annotations
        data["updated_at"] = datetime.utcnow()
        
        await db.floor_plans.update_one(
            {"owner_id": owner_id},
            {"$set": data}
        )
        
        return {"message": "Annotation deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete annotation: {str(e)}")

@router.put("/owners/{owner_id}/floor-plan/annotations/{annotation_id}")
async def update_annotation(owner_id: str, annotation_id: str, annotation_update: AnnotationCreate):
    """
    Update an annotation
    """
    try:
        data = await db.floor_plans.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            raise HTTPException(status_code=404, detail="Floor plan not found")
        
        # Find and update annotation
        annotations = data.get("annotations", [])
        annotation_index = next((i for i, ann in enumerate(annotations) if ann["id"] == annotation_id), None)
        
        if annotation_index is None:
            raise HTTPException(status_code=404, detail="Annotation not found")
        
        # Update annotation fields
        update_dict = annotation_update.dict(exclude_unset=True)
        for key, value in update_dict.items():
            annotations[annotation_index][key] = value
        
        data["annotations"] = annotations
        data["updated_at"] = datetime.utcnow()
        
        await db.floor_plans.update_one(
            {"owner_id": owner_id},
            {"$set": data}
        )
        
        return annotations[annotation_index]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update annotation: {str(e)}")
