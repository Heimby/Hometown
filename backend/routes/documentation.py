from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from models.property_documentation import (
    PropertyDocumentation, 
    SecuritySystemItem,
    SecuritySystemItemCreate,
    SecuritySystemItemUpdate,
    DocumentationImage,
    DocumentationFile
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

@router.get("/owners/{owner_id}/documentation")
async def get_owner_documentation(owner_id: str):
    """
    Get all documentation for an owner
    """
    try:
        # Check if owner exists
        owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})
        if not owner:
            raise HTTPException(status_code=404, detail="Owner not found")
        
        # Get or create documentation
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            # Create new documentation for owner
            new_doc = PropertyDocumentation(owner_id=owner_id)
            await db.property_documentation.insert_one(new_doc.dict())
            return new_doc.dict()
        
        return doc
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch documentation: {str(e)}")

@router.post("/owners/{owner_id}/documentation/security-systems")
async def create_security_system_item(owner_id: str, item: SecuritySystemItemCreate):
    """
    Create a new security system item
    """
    try:
        # Get or create documentation
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            # Create new documentation
            new_doc = PropertyDocumentation(owner_id=owner_id)
            doc = new_doc.dict()
        
        # Create new item
        new_item = SecuritySystemItem(**item.dict())
        
        # Add to security_systems array
        if "security_systems" not in doc:
            doc["security_systems"] = []
        
        doc["security_systems"].append(new_item.dict())
        doc["updated_at"] = datetime.utcnow()
        
        # Upsert document
        await db.property_documentation.update_one(
            {"owner_id": owner_id},
            {"$set": doc},
            upsert=True
        )
        
        return new_item.dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create security system item: {str(e)}")

@router.get("/owners/{owner_id}/documentation/security-systems")
async def get_security_systems(owner_id: str):
    """
    Get all security system items for an owner
    """
    try:
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            return []
        
        return doc.get("security_systems", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch security systems: {str(e)}")

@router.get("/owners/{owner_id}/documentation/security-systems/{item_id}")
async def get_security_system_item(owner_id: str, item_id: str):
    """
    Get a specific security system item
    """
    try:
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            raise HTTPException(status_code=404, detail="Documentation not found")
        
        items = doc.get("security_systems", [])
        item = next((i for i in items if i["id"] == item_id), None)
        
        if not item:
            raise HTTPException(status_code=404, detail="Security system item not found")
        
        return item
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch security system item: {str(e)}")

@router.put("/owners/{owner_id}/documentation/security-systems/{item_id}")
async def update_security_system_item(owner_id: str, item_id: str, update_data: SecuritySystemItemUpdate):
    """
    Update a security system item
    """
    try:
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            raise HTTPException(status_code=404, detail="Documentation not found")
        
        items = doc.get("security_systems", [])
        item_index = next((i for i, item in enumerate(items) if item["id"] == item_id), None)
        
        if item_index is None:
            raise HTTPException(status_code=404, detail="Security system item not found")
        
        # Update item fields
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            items[item_index][key] = value
        
        items[item_index]["updated_at"] = datetime.utcnow()
        
        # Update document
        await db.property_documentation.update_one(
            {"owner_id": owner_id},
            {"$set": {
                "security_systems": items,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return items[item_index]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update security system item: {str(e)}")

@router.delete("/owners/{owner_id}/documentation/security-systems/{item_id}")
async def delete_security_system_item(owner_id: str, item_id: str):
    """
    Delete a security system item
    """
    try:
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            raise HTTPException(status_code=404, detail="Documentation not found")
        
        items = doc.get("security_systems", [])
        items = [item for item in items if item["id"] != item_id]
        
        # Update document
        await db.property_documentation.update_one(
            {"owner_id": owner_id},
            {"$set": {
                "security_systems": items,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {"message": "Security system item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete security system item: {str(e)}")

@router.post("/owners/{owner_id}/documentation/security-systems/{item_id}/upload-image")
async def upload_image(owner_id: str, item_id: str, file: UploadFile = File(...), caption: str = Form(None)):
    """
    Upload an image for a security system item
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{uuid4()}.{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create image URL (relative path)
        image_url = f"/uploads/{unique_filename}"
        
        # Create DocumentationImage object
        doc_image = DocumentationImage(
            url=image_url,
            caption=caption
        )
        
        # Update item in database
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            raise HTTPException(status_code=404, detail="Documentation not found")
        
        items = doc.get("security_systems", [])
        item_index = next((i for i, item in enumerate(items) if item["id"] == item_id), None)
        
        if item_index is None:
            raise HTTPException(status_code=404, detail="Security system item not found")
        
        # Add image to item
        if "images" not in items[item_index]:
            items[item_index]["images"] = []
        
        items[item_index]["images"].append(doc_image.dict())
        items[item_index]["updated_at"] = datetime.utcnow()
        
        # Update document
        await db.property_documentation.update_one(
            {"owner_id": owner_id},
            {"$set": {
                "security_systems": items,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return doc_image.dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@router.post("/owners/{owner_id}/documentation/security-systems/{item_id}/upload-document")
async def upload_document(owner_id: str, item_id: str, file: UploadFile = File(...)):
    """
    Upload a document (PDF) for a security system item
    """
    try:
        # Validate file type
        allowed_types = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="File must be PDF or Word document")
        
        # Generate unique filename
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{uuid4()}.{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = file_path.stat().st_size
        
        # Create document URL
        doc_url = f"/uploads/{unique_filename}"
        
        # Create DocumentationFile object
        doc_file = DocumentationFile(
            url=doc_url,
            filename=file.filename,
            file_type=file_ext,
            size=file_size
        )
        
        # Update item in database
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            raise HTTPException(status_code=404, detail="Documentation not found")
        
        items = doc.get("security_systems", [])
        item_index = next((i for i, item in enumerate(items) if item["id"] == item_id), None)
        
        if item_index is None:
            raise HTTPException(status_code=404, detail="Security system item not found")
        
        # Add document to item
        if "documents" not in items[item_index]:
            items[item_index]["documents"] = []
        
        items[item_index]["documents"].append(doc_file.dict())
        items[item_index]["updated_at"] = datetime.utcnow()
        
        # Update document
        await db.property_documentation.update_one(
            {"owner_id": owner_id},
            {"$set": {
                "security_systems": items,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return doc_file.dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")

@router.delete("/owners/{owner_id}/documentation/security-systems/{item_id}/images/{image_id}")
async def delete_image(owner_id: str, item_id: str, image_id: str):
    """
    Delete an image from a security system item
    """
    try:
        doc = await db.property_documentation.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not doc:
            raise HTTPException(status_code=404, detail="Documentation not found")
        
        items = doc.get("security_systems", [])
        item_index = next((i for i, item in enumerate(items) if item["id"] == item_id), None)
        
        if item_index is None:
            raise HTTPException(status_code=404, detail="Security system item not found")
        
        # Remove image
        images = items[item_index].get("images", [])
        images = [img for img in images if img["id"] != image_id]
        items[item_index]["images"] = images
        items[item_index]["updated_at"] = datetime.utcnow()
        
        # Update document
        await db.property_documentation.update_one(
            {"owner_id": owner_id},
            {"$set": {
                "security_systems": items,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {"message": "Image deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")
