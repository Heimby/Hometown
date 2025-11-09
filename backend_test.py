#!/usr/bin/env python3
"""
DigiHome Backend API Testing Suite
Tests all backend endpoints for lead submission and owner portal creation
"""

import requests
import json
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://homeeasy-app.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing DigiHome Backend API at: {API_BASE}")
print("=" * 60)

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
        print("\n" + "=" * 60)
        print(f"TEST SUMMARY: {self.passed} passed, {self.failed} failed")
        if self.errors:
            print("\nFAILED TESTS:")
            for error in self.errors:
                print(f"  - {error}")
        return self.failed == 0

results = TestResults()

# Generate unique test data for each test run
import time
test_timestamp = int(time.time())

# Test data
test_lead_data = {
    "address": "Storgata 15, 0155 Oslo, Norway",
    "name": "Erik Nordahl",
    "phone": "+47 987 65 432",
    "email": f"erik.nordahl.{test_timestamp}@example.no"
}

test_owner_data = {
    "address": "Storgata 15, 0155 Oslo, Norway", 
    "name": "Erik Nordahl",
    "phone": "+47 987 65 432",
    "email": f"erik.nordahl.{test_timestamp}@example.no",
    "password": "SecurePassword123!"
}

# Different test data for duplicate tests
test_lead_data_2 = {
    "address": "Karl Johans gate 22, 0159 Oslo, Norway",
    "name": "Astrid Hansen",
    "phone": "+47 456 78 901",
    "email": "astrid.hansen@example.no"
}

def test_api_root():
    """Test API root endpoint"""
    try:
        response = requests.get(f"{API_BASE}/")
        if response.status_code == 200:
            data = response.json()
            if "DigiHome API" in data.get("message", ""):
                results.add_pass("API Root endpoint")
                return True
            else:
                results.add_fail("API Root endpoint", f"Unexpected message: {data}")
                return False
        else:
            results.add_fail("API Root endpoint", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        results.add_fail("API Root endpoint", f"Connection error: {str(e)}")
        return False

def test_lead_creation():
    """Test POST /api/leads - Create new lead"""
    try:
        response = requests.post(f"{API_BASE}/leads", json=test_lead_data)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response structure
            required_fields = ['id', 'address', 'name', 'phone', 'email', 'created_at', 'status']
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                results.add_fail("Lead creation - response structure", f"Missing fields: {missing_fields}")
                return False, None
            
            # Verify field values
            if data['status'] != 'new':
                results.add_fail("Lead creation - status", f"Expected 'new', got '{data['status']}'")
                return False, None
            
            if data['email'] != test_lead_data['email']:
                results.add_fail("Lead creation - email", f"Email mismatch")
                return False, None
            
            # Verify UUID format
            try:
                uuid.UUID(data['id'])
            except ValueError:
                results.add_fail("Lead creation - UUID", f"Invalid UUID format: {data['id']}")
                return False, None
            
            results.add_pass("Lead creation with valid data")
            return True, data['id']
        else:
            results.add_fail("Lead creation", f"Status code: {response.status_code}, Response: {response.text}")
            return False, None
    except Exception as e:
        results.add_fail("Lead creation", f"Error: {str(e)}")
        return False, None

def test_lead_duplicate_email():
    """Test POST /api/leads - Duplicate email should update existing lead"""
    try:
        # Create lead with same email but different data
        updated_data = test_lead_data.copy()
        updated_data['name'] = "Erik Nordahl Updated"
        updated_data['address'] = "Updated Address, Oslo"
        
        response = requests.post(f"{API_BASE}/leads", json=updated_data)
        
        if response.status_code == 200:
            data = response.json()
            if data['name'] == "Erik Nordahl Updated":
                results.add_pass("Lead duplicate email handling (update)")
                return True
            else:
                results.add_fail("Lead duplicate email", f"Name not updated: {data['name']}")
                return False
        else:
            results.add_fail("Lead duplicate email", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        results.add_fail("Lead duplicate email", f"Error: {str(e)}")
        return False

def test_lead_invalid_email():
    """Test POST /api/leads - Invalid email format"""
    try:
        invalid_data = test_lead_data.copy()
        invalid_data['email'] = "invalid-email-format"
        
        response = requests.post(f"{API_BASE}/leads", json=invalid_data)
        
        # Should return 422 for validation error
        if response.status_code == 422:
            results.add_pass("Lead invalid email validation")
            return True
        else:
            results.add_fail("Lead invalid email", f"Expected 422, got {response.status_code}")
            return False
    except Exception as e:
        results.add_fail("Lead invalid email", f"Error: {str(e)}")
        return False

def test_lead_missing_fields():
    """Test POST /api/leads - Missing required fields"""
    try:
        incomplete_data = {"name": "Test User"}  # Missing required fields
        
        response = requests.post(f"{API_BASE}/leads", json=incomplete_data)
        
        # Should return 422 for validation error
        if response.status_code == 422:
            results.add_pass("Lead missing fields validation")
            return True
        else:
            results.add_fail("Lead missing fields", f"Expected 422, got {response.status_code}")
            return False
    except Exception as e:
        results.add_fail("Lead missing fields", f"Error: {str(e)}")
        return False

def test_owner_portal_creation():
    """Test POST /api/owner-portal - Create owner portal"""
    try:
        response = requests.post(f"{API_BASE}/owner-portal", json=test_owner_data)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response structure
            required_fields = ['id', 'name', 'email', 'address', 'created_at', 'is_active']
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                results.add_fail("Owner portal creation - structure", f"Missing fields: {missing_fields}")
                return False, None
            
            # Verify password_hash is NOT in response
            if 'password_hash' in data:
                results.add_fail("Owner portal creation - security", "password_hash exposed in response")
                return False, None
            
            # Verify field values
            if data['email'] != test_owner_data['email']:
                results.add_fail("Owner portal creation - email", "Email mismatch")
                return False, None
            
            if not data['is_active']:
                results.add_fail("Owner portal creation - is_active", "Should be active by default")
                return False, None
            
            # Verify UUID format
            try:
                uuid.UUID(data['id'])
            except ValueError:
                results.add_fail("Owner portal creation - UUID", f"Invalid UUID: {data['id']}")
                return False, None
            
            results.add_pass("Owner portal creation with valid data")
            return True, data['id']
        else:
            results.add_fail("Owner portal creation", f"Status code: {response.status_code}, Response: {response.text}")
            return False, None
    except Exception as e:
        results.add_fail("Owner portal creation", f"Error: {str(e)}")
        return False, None

def test_owner_portal_duplicate():
    """Test POST /api/owner-portal - Duplicate owner should return 400"""
    try:
        response = requests.post(f"{API_BASE}/owner-portal", json=test_owner_data)
        
        if response.status_code == 400:
            results.add_pass("Owner portal duplicate prevention")
            return True
        else:
            results.add_fail("Owner portal duplicate", f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        results.add_fail("Owner portal duplicate", f"Error: {str(e)}")
        return False

def test_owner_portal_missing_password():
    """Test POST /api/owner-portal - Missing password"""
    try:
        incomplete_data = test_owner_data.copy()
        del incomplete_data['password']
        
        response = requests.post(f"{API_BASE}/owner-portal", json=incomplete_data)
        
        if response.status_code == 422:
            results.add_pass("Owner portal missing password validation")
            return True
        else:
            results.add_fail("Owner portal missing password", f"Expected 422, got {response.status_code}")
            return False
    except Exception as e:
        results.add_fail("Owner portal missing password", f"Error: {str(e)}")
        return False

def test_get_leads():
    """Test GET /api/leads - List all leads"""
    try:
        response = requests.get(f"{API_BASE}/leads")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("Get all leads")
                return True
            else:
                results.add_fail("Get all leads", f"Expected list, got {type(data)}")
                return False
        else:
            results.add_fail("Get all leads", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        results.add_fail("Get all leads", f"Error: {str(e)}")
        return False

def test_get_owners():
    """Test GET /api/owners - List all owners"""
    try:
        response = requests.get(f"{API_BASE}/owners")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Verify no password_hash in any owner
                for owner in data:
                    if 'password_hash' in owner:
                        results.add_fail("Get all owners - security", "password_hash exposed")
                        return False
                results.add_pass("Get all owners (without password_hash)")
                return True
            else:
                results.add_fail("Get all owners", f"Expected list, got {type(data)}")
                return False
        else:
            results.add_fail("Get all owners", f"Status code: {response.status_code}")
            return False
    except Exception as e:
        results.add_fail("Get all owners", f"Error: {str(e)}")
        return False

def test_lead_status_conversion():
    """Test that lead status is updated to 'converted' after owner portal creation"""
    try:
        # First create a new lead
        new_lead_data = test_lead_data_2.copy()
        lead_response = requests.post(f"{API_BASE}/leads", json=new_lead_data)
        
        if lead_response.status_code != 200:
            results.add_fail("Lead status conversion - lead creation", f"Failed to create test lead")
            return False
        
        lead_id = lead_response.json()['id']
        
        # Create owner portal for the same email
        owner_data = new_lead_data.copy()
        owner_data['password'] = "TestPassword123!"
        
        owner_response = requests.post(f"{API_BASE}/owner-portal", json=owner_data)
        
        if owner_response.status_code != 200:
            results.add_fail("Lead status conversion - owner creation", f"Failed to create owner portal")
            return False
        
        # Check if lead status was updated
        lead_check_response = requests.get(f"{API_BASE}/leads/{lead_id}")
        
        if lead_check_response.status_code == 200:
            lead_data = lead_check_response.json()
            if lead_data.get('status') == 'converted':
                results.add_pass("Lead status conversion to 'converted'")
                return True
            else:
                results.add_fail("Lead status conversion", f"Expected 'converted', got '{lead_data.get('status')}'")
                return False
        else:
            results.add_fail("Lead status conversion - verification", f"Could not fetch lead: {lead_check_response.status_code}")
            return False
    except Exception as e:
        results.add_fail("Lead status conversion", f"Error: {str(e)}")
        return False

# Run all tests
def run_all_tests():
    print("Starting DigiHome Backend API Tests...")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    print()
    
    # Test API connectivity first
    if not test_api_root():
        print("❌ API is not accessible. Stopping tests.")
        return False
    
    print()
    
    # Test lead endpoints
    print("Testing Lead Endpoints:")
    print("-" * 30)
    lead_success, lead_id = test_lead_creation()
    test_lead_duplicate_email()
    test_lead_invalid_email()
    test_lead_missing_fields()
    test_get_leads()
    
    print()
    
    # Test owner portal endpoints
    print("Testing Owner Portal Endpoints:")
    print("-" * 35)
    owner_success, owner_id = test_owner_portal_creation()
    test_owner_portal_duplicate()
    test_owner_portal_missing_password()
    test_get_owners()
    
    print()
    
    # Test integration
    print("Testing Integration:")
    print("-" * 20)
    test_lead_status_conversion()
    
    print()
    
    return results.summary()

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)