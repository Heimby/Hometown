from fastapi import APIRouter, HTTPException
from models.furniture_equipment import (
    FurnitureEquipmentData,
    FurnitureItem,
    FurnitureItemCreate,
    FurnitureItemUpdate,
    FurnitureEquipmentUpdate
)
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime

router = APIRouter()

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'digihome')]

# Default items for each category
DEFAULT_KITCHEN_ITEMS = [
    {"name": "Stekepanner (Non-stick, induksjon)", "quantity": "2", "comment": "medium + stor"},
    {"name": "Små/medium kasseroller (induksjon)", "quantity": "2", "comment": ""},
    {"name": "Gryte (induksjon)", "quantity": "1", "comment": ""},
    {"name": "Stekebrett", "quantity": "1", "comment": ""},
    {"name": "Stekerist", "quantity": "1", "comment": ""},
    {"name": "Boller til baking", "quantity": "Sett på 3-4 stk", "comment": ""},
    {"name": "Pastasil", "quantity": "1", "comment": ""},
    {"name": "Skjærebrett", "quantity": "2", "comment": ""},
    {"name": "Knivsett", "quantity": "4 stk", "comment": "3 skjærekniver + brødkniv"},
    {"name": "Kjøkkenvekt", "quantity": "1", "comment": ""},
    {"name": "Flaskeåpner / vinåpner", "quantity": "2", "comment": ""},
    {"name": "Grønnsaksrenser", "quantity": "1", "comment": ""},
    {"name": "Rivjern", "quantity": "1", "comment": ""},
    {"name": "Saks", "quantity": "1-2", "comment": ""},
    {"name": "Ovnhansker / gryteholdere", "quantity": "2-4", "comment": ""},
    {"name": "Gryteunderlag", "quantity": "4", "comment": ""},
    {"name": "Kaffetrakter", "quantity": "1", "comment": ""},
    {"name": "Vannkoker", "quantity": "1", "comment": ""},
    {"name": "Tørkerull-holder", "quantity": "1", "comment": ""},
    {"name": "Målebegere", "quantity": "2", "comment": ""},
    {"name": "Ostehøvel", "quantity": "2", "comment": ""},
    {"name": "Kjøkkenredskaper (stekespade etc.)", "quantity": "2 fulle sett", "comment": ""}
]

DEFAULT_TABLEWARE_ITEMS = [
    {"name": "Store tallerkener", "quantity": "2x Max gjester", "comment": ""},
    {"name": "Små tallerkener", "quantity": "2x Max gjester", "comment": ""},
    {"name": "Store skåler", "quantity": "2x Max gjester", "comment": ""},
    {"name": "Små skåler", "quantity": "2x Max gjester", "comment": ""},
    {"name": "Kaffekopper", "quantity": "2x Max gjester", "comment": ""},
    {"name": "Glass", "quantity": "2x Max gjester", "comment": ""},
    {"name": "Vinglass", "quantity": "1x Max gjester", "comment": ""},
    {"name": "Bestikk (Kniver, gafler, skjeer)", "quantity": "2x Max gjester", "comment": ""}
]

DEFAULT_HOUSEHOLD_ITEMS = [
    {"name": "Vaskemaskin", "quantity": "1", "comment": ""},
    {"name": "Strykebrett + strykejern", "quantity": "1 + 1", "comment": ""},
    {"name": "Tørkestativ", "quantity": "1", "comment": ""},
    {"name": "Hårføner", "quantity": "1", "comment": ""},
    {"name": "Vaskenal til dusj", "quantity": "1", "comment": ""},
    {"name": "Knagger til håndklær og klær", "quantity": "Tilstrekkelig", "comment": ""},
    {"name": "Støvsuger", "quantity": "1", "comment": ""},
    {"name": "Mopp", "quantity": "1", "comment": ""},
    {"name": "Bøtte", "quantity": "1", "comment": ""}
]

def create_default_items():
    """Create default furniture items"""
    items = []
    
    for item_data in DEFAULT_KITCHEN_ITEMS:
        items.append(FurnitureItem(
            name=item_data["name"],
            quantity=item_data["quantity"],
            comment=item_data["comment"],
            category="kitchen",
            checked=False
        ))
    
    for item_data in DEFAULT_TABLEWARE_ITEMS:
        items.append(FurnitureItem(
            name=item_data["name"],
            quantity=item_data["quantity"],
            comment=item_data["comment"],
            category="tableware",
            checked=False
        ))
    
    for item_data in DEFAULT_HOUSEHOLD_ITEMS:
        items.append(FurnitureItem(
            name=item_data["name"],
            quantity=item_data["quantity"],
            comment=item_data["comment"],
            category="household",
            checked=False
        ))
    
    return items

@router.get("/owners/{owner_id}/furniture-equipment")
async def get_furniture_equipment(owner_id: str):
    """
    Get furniture equipment checklist for an owner
    """
    try:
        # Check if owner exists
        owner = await db.owners.find_one({"id": owner_id}, {"_id": 0})
        if not owner:
            raise HTTPException(status_code=404, detail="Owner not found")
        
        # Get or create furniture equipment data
        data = await db.furniture_equipment.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            # Create new data with default items
            new_data = FurnitureEquipmentData(
                owner_id=owner_id,
                items=[item.dict() for item in create_default_items()]
            )
            await db.furniture_equipment.insert_one(new_data.dict())
            return new_data.dict()
        
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch furniture equipment: {str(e)}")

@router.put("/owners/{owner_id}/furniture-equipment")
async def update_furniture_equipment(owner_id: str, update_data: FurnitureEquipmentUpdate):
    """
    Update general comments and confirmation status
    """
    try:
        data = await db.furniture_equipment.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            raise HTTPException(status_code=404, detail="Furniture equipment data not found")
        
        # Update fields
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            data[key] = value
        
        data["updated_at"] = datetime.utcnow()
        
        await db.furniture_equipment.update_one(
            {"owner_id": owner_id},
            {"$set": data}
        )
        
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update furniture equipment: {str(e)}")

@router.post("/owners/{owner_id}/furniture-equipment/items")
async def create_furniture_item(owner_id: str, item: FurnitureItemCreate):
    """
    Add a new furniture item to the checklist
    """
    try:
        data = await db.furniture_equipment.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            raise HTTPException(status_code=404, detail="Furniture equipment data not found")
        
        # Create new item
        new_item = FurnitureItem(**item.dict())
        
        if "items" not in data:
            data["items"] = []
        
        data["items"].append(new_item.dict())
        data["updated_at"] = datetime.utcnow()
        
        await db.furniture_equipment.update_one(
            {"owner_id": owner_id},
            {"$set": data}
        )
        
        return new_item.dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create furniture item: {str(e)}")

@router.put("/owners/{owner_id}/furniture-equipment/items/{item_id}")
async def update_furniture_item(owner_id: str, item_id: str, update_data: FurnitureItemUpdate):
    """
    Update a furniture item (e.g., check/uncheck, edit details)
    """
    try:
        data = await db.furniture_equipment.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            raise HTTPException(status_code=404, detail="Furniture equipment data not found")
        
        items = data.get("items", [])
        item_index = next((i for i, item in enumerate(items) if item["id"] == item_id), None)
        
        if item_index is None:
            raise HTTPException(status_code=404, detail="Furniture item not found")
        
        # Update item fields
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            items[item_index][key] = value
        
        data["items"] = items
        data["updated_at"] = datetime.utcnow()
        
        await db.furniture_equipment.update_one(
            {"owner_id": owner_id},
            {"$set": data}
        )
        
        return items[item_index]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update furniture item: {str(e)}")

@router.delete("/owners/{owner_id}/furniture-equipment/items/{item_id}")
async def delete_furniture_item(owner_id: str, item_id: str):
    """
    Delete a furniture item from the checklist
    """
    try:
        data = await db.furniture_equipment.find_one({"owner_id": owner_id}, {"_id": 0})
        
        if not data:
            raise HTTPException(status_code=404, detail="Furniture equipment data not found")
        
        items = data.get("items", [])
        items = [item for item in items if item["id"] != item_id]
        
        data["items"] = items
        data["updated_at"] = datetime.utcnow()
        
        await db.furniture_equipment.update_one(
            {"owner_id": owner_id},
            {"$set": data}
        )
        
        return {"message": "Furniture item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete furniture item: {str(e)}")
