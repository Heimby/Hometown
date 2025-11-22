#!/usr/bin/env python3
"""
DigiHome Onboarding Flag Testing Suite
Specific test for onboarding_completed flag behavior as requested in review
"""

import requests
import json
import uuid
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://digihome-docs.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"🎯 TESTING ONBOARDING_COMPLETED FLAG BEHAVIOR")
print(f"Backend URL: {BACKEND_URL}")
print(f"API Base: {API_BASE}")
print("=" * 80)

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
    
    def add_pass(self, test_name):
        self.passed += 1
        print(f"✅ PASS: {test_name}")
    
    def add_fail(self, test_name, error):
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        print(f"❌ FAIL: {test_name} - {error}")
    
    def summary(self):
        print("\n" + "=" * 80)
        print(f"🎯 ONBOARDING FLAG TEST SUMMARY: {self.passed} passed, {self.failed} failed")
        if self.errors:
            print("\n❌ FAILED TESTS:")
            for error in self.errors:
                print(f"  - {error}")
        else:
            print("\n🎉 ALL ONBOARDING FLAG TESTS PASSED!")
        return self.failed == 0

results = TestResults()

def test_onboarding_completed_flag_flow():
    """
    Test the complete user onboarding flow to verify onboarding_completed flag is correctly set
    
    This test follows the exact requirements from the review request:
    1. Create a new owner via POST /api/owner-portal with unique email
    2. Verify response includes onboarding_completed: false (CRITICAL!)
    3. GET the owner via /api/owners/{owner_id} and verify onboarding_completed is false
    4. Simulate onboarding completion by PUT to /api/owners/{owner_id}/onboarding
    5. GET the owner again and verify onboarding_completed is now true
    """
    
    # Generate unique test data
    test_timestamp = int(time.time())
    random_suffix = str(uuid.uuid4())[:8]
    
    test_owner_data = {
        "address": "Test Street 123",
        "name": "Test User",
        "phone": "+47 12345678",
        "email": f"testonboarding{random_suffix}@test.com",
        "password": "temp_password_123"
    }
    
    print(f"\n🔍 STEP 1: Creating new owner with email: {test_owner_data['email']}")
    print("-" * 60)
    
    try:
        # Step 1: Create new owner via POST /api/owner-portal
        response = requests.post(f"{API_BASE}/owner-portal", json=test_owner_data)
        
        if response.status_code != 200:
            results.add_fail("Owner creation", f"Status code: {response.status_code}, Response: {response.text}")
            return False
        
        owner_data = response.json()
        owner_id = owner_data.get('id')
        
        if not owner_id:
            results.add_fail("Owner creation - ID field", "No 'id' field in response")
            return False
        
        print(f"✅ Owner created successfully with ID: {owner_id}")
        
        # Step 2: CRITICAL - Verify response includes onboarding_completed: false
        onboarding_completed = owner_data.get('onboarding_completed')
        if onboarding_completed is None:
            results.add_fail("Owner creation - onboarding_completed field missing", "onboarding_completed field not present in response")
            return False
        
        if onboarding_completed != False:
            results.add_fail("Owner creation - onboarding_completed value", f"Expected False, got {onboarding_completed}")
            return False
        
        print(f"✅ CRITICAL CHECK PASSED: onboarding_completed = {onboarding_completed} in creation response")
        results.add_pass("New owner creation with onboarding_completed: false")
        
        print(f"\n🔍 STEP 2: Getting owner via GET /api/owners/{owner_id}")
        print("-" * 60)
        
        # Step 3: GET the owner via /api/owners/{owner_id} and verify onboarding_completed is false
        get_response = requests.get(f"{API_BASE}/owners/{owner_id}")
        
        if get_response.status_code != 200:
            results.add_fail("Owner retrieval", f"Status code: {get_response.status_code}, Response: {get_response.text}")
            return False
        
        retrieved_owner = get_response.json()
        retrieved_onboarding_completed = retrieved_owner.get('onboarding_completed')
        
        if retrieved_onboarding_completed is None:
            results.add_fail("Owner retrieval - onboarding_completed field missing", "onboarding_completed field not present in GET response")
            return False
        
        if retrieved_onboarding_completed != False:
            results.add_fail("Owner retrieval - onboarding_completed value", f"Expected False, got {retrieved_onboarding_completed}")
            return False
        
        print(f"✅ CRITICAL CHECK PASSED: onboarding_completed = {retrieved_onboarding_completed} in GET response")
        results.add_pass("Owner retrieval with onboarding_completed: false")
        
        print(f"\n🔍 STEP 3: Simulating onboarding completion via PUT /api/owners/{owner_id}/onboarding")
        print("-" * 60)
        
        # Step 4: Simulate onboarding completion by PUT to /api/owners/{owner_id}/onboarding
        onboarding_data = {
            "address": "Test Street 123",
            "city": "Oslo",
            "unit": "H0101",
            "property_type": "apartment",
            "ownership_type": "selveier",
            "rental_strategy": "airbnb",
            "start_date": "2025-01-15",
            "end_date": None,
            "rooms": {
                "living": [{"id": 1, "type": "living", "furniture": [{"id": 1, "type": "sofa", "details": {"seats": 3}}]}],
                "bedroom": [{"id": 2, "type": "bedroom", "furniture": [{"id": 2, "type": "bed", "details": {"width": 160}}]}],
                "bathroom": [{"id": 3, "type": "bathroom", "amenities": ["dusj", "toalett"]}]
            },
            "facilities": ["balkong", "heis"],
            "parking": "none",
            "photography": "professional",
            "cleaning": "self"
        }
        
        onboarding_response = requests.put(f"{API_BASE}/owners/{owner_id}/onboarding", json=onboarding_data)
        
        if onboarding_response.status_code != 200:
            results.add_fail("Onboarding completion", f"Status code: {onboarding_response.status_code}, Response: {onboarding_response.text}")
            return False
        
        onboarding_result = onboarding_response.json()
        print(f"✅ Onboarding data submitted successfully: {onboarding_result.get('message')}")
        results.add_pass("Onboarding data submission")
        
        print(f"\n🔍 STEP 4: Final verification - GET owner to confirm onboarding_completed = true")
        print("-" * 60)
        
        # Step 5: GET the owner again and verify onboarding_completed is now true
        final_get_response = requests.get(f"{API_BASE}/owners/{owner_id}")
        
        if final_get_response.status_code != 200:
            results.add_fail("Final owner retrieval", f"Status code: {final_get_response.status_code}, Response: {final_get_response.text}")
            return False
        
        final_owner = final_get_response.json()
        final_onboarding_completed = final_owner.get('onboarding_completed')
        
        if final_onboarding_completed is None:
            results.add_fail("Final owner retrieval - onboarding_completed field missing", "onboarding_completed field not present in final GET response")
            return False
        
        if final_onboarding_completed != True:
            results.add_fail("Final owner retrieval - onboarding_completed value", f"Expected True, got {final_onboarding_completed}")
            return False
        
        print(f"✅ CRITICAL CHECK PASSED: onboarding_completed = {final_onboarding_completed} after onboarding completion")
        results.add_pass("Final verification - onboarding_completed: true")
        
        # Additional verification: Check that onboarding_data is present
        onboarding_data_saved = final_owner.get('onboarding_data')
        if not onboarding_data_saved:
            results.add_fail("Onboarding data verification", "onboarding_data not saved in owner record")
            return False
        
        print(f"✅ Onboarding data correctly saved with {len(onboarding_data_saved)} fields")
        results.add_pass("Onboarding data persistence verification")
        
        print(f"\n🎉 COMPLETE ONBOARDING FLAG FLOW TEST SUCCESSFUL!")
        print(f"📋 Test Summary:")
        print(f"   • Owner ID: {owner_id}")
        print(f"   • Email: {test_owner_data['email']}")
        print(f"   • Initial onboarding_completed: False ✅")
        print(f"   • After onboarding onboarding_completed: True ✅")
        print(f"   • Onboarding data saved: {len(onboarding_data_saved)} fields ✅")
        
        return True
        
    except Exception as e:
        results.add_fail("Onboarding flag flow test", f"Unexpected error: {str(e)}")
        return False

def run_onboarding_flag_test():
    """Run the specific onboarding flag test as requested in the review"""
    print("🎯 Starting Onboarding Flag Behavior Test...")
    print("This test verifies the critical onboarding_completed flag behavior")
    print()
    
    success = test_onboarding_completed_flag_flow()
    
    return results.summary()

if __name__ == "__main__":
    success = run_onboarding_flag_test()
    exit(0 if success else 1)