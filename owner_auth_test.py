#!/usr/bin/env python3
"""
DigiHome Owner Authentication Flow Testing
Tests the complete owner registration and login flow as requested
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
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://realdocs.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing DigiHome Owner Authentication Flow at: {API_BASE}")
print("=" * 70)

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
        print("\n" + "=" * 70)
        print(f"AUTHENTICATION FLOW TEST SUMMARY: {self.passed} passed, {self.failed} failed")
        if self.errors:
            print("\nFAILED TESTS:")
            for error in self.errors:
                print(f"  - {error}")
        return self.failed == 0

results = TestResults()

def test_scenario_1_new_user_registration_and_login():
    """
    Test Scenario 1: New User Registration and Login
    1. Create a new owner by POSTing to /api/owner-portal
    2. Verify the response contains an id field
    3. Then POST to /api/owners/login with the same email
    4. Verify the login returns the owner data including the same id
    """
    print("\n" + "="*50)
    print("TEST SCENARIO 1: New User Registration and Login")
    print("="*50)
    
    # Generate unique test data
    test_timestamp = int(time.time())
    random_suffix = str(uuid.uuid4())[:8]
    
    test_owner_data = {
        "email": f"uniquetest{random_suffix}@test.com",
        "name": "Test User",
        "address": "Test Gate 123",
        "phone": "+47 12345678",
        "password": "temp123"
    }
    
    try:
        # Step 1: Create new owner
        print(f"Step 1: Creating new owner with email: {test_owner_data['email']}")
        registration_response = requests.post(f"{API_BASE}/owner-portal", json=test_owner_data)
        
        if registration_response.status_code != 200:
            results.add_fail("Scenario 1 - Owner Registration", 
                           f"Status: {registration_response.status_code}, Response: {registration_response.text}")
            return False
        
        registration_data = registration_response.json()
        print(f"✅ Owner created successfully")
        
        # Step 2: Verify response contains id field
        if 'id' not in registration_data:
            results.add_fail("Scenario 1 - Registration Response", "Missing 'id' field in response")
            return False
        
        owner_id = registration_data['id']
        print(f"✅ Registration response contains id: {owner_id}")
        
        # Verify UUID format
        try:
            uuid.UUID(owner_id)
            print(f"✅ ID is valid UUID format")
        except ValueError:
            results.add_fail("Scenario 1 - UUID Format", f"Invalid UUID format: {owner_id}")
            return False
        
        # Step 3: Login with the same email
        print(f"Step 3: Logging in with email: {test_owner_data['email']}")
        login_data = {"email": test_owner_data['email']}
        login_response = requests.post(f"{API_BASE}/owners/login", json=login_data)
        
        if login_response.status_code != 200:
            results.add_fail("Scenario 1 - Owner Login", 
                           f"Status: {login_response.status_code}, Response: {login_response.text}")
            return False
        
        login_result = login_response.json()
        print(f"✅ Login successful")
        
        # Step 4: Verify login returns owner data with same id
        if 'id' not in login_result:
            results.add_fail("Scenario 1 - Login Response", "Missing 'id' field in login response")
            return False
        
        if login_result['id'] != owner_id:
            results.add_fail("Scenario 1 - ID Match", 
                           f"Login ID ({login_result['id']}) doesn't match registration ID ({owner_id})")
            return False
        
        print(f"✅ Login response contains same id: {login_result['id']}")
        
        # Verify other essential fields
        essential_fields = ['name', 'email', 'address']
        for field in essential_fields:
            if field not in login_result:
                results.add_fail("Scenario 1 - Login Data", f"Missing '{field}' in login response")
                return False
            if login_result[field] != test_owner_data[field]:
                results.add_fail("Scenario 1 - Data Consistency", 
                               f"{field} mismatch: expected '{test_owner_data[field]}', got '{login_result[field]}'")
                return False
        
        print(f"✅ All owner data matches between registration and login")
        
        # Verify password_hash is not exposed
        if 'password_hash' in login_result:
            results.add_fail("Scenario 1 - Security", "password_hash exposed in login response")
            return False
        
        print(f"✅ Password hash not exposed in login response")
        
        results.add_pass("Scenario 1 - Complete New User Registration and Login Flow")
        return True
        
    except Exception as e:
        results.add_fail("Scenario 1 - Exception", f"Error: {str(e)}")
        return False

def test_scenario_2_login_nonexistent_email():
    """
    Test Scenario 2: Login with Non-Existent Email
    1. POST to /api/owners/login with email: "doesnotexist@test.com"
    2. Verify response is 404 with message "Ingen eierportal funnet. Vennligst registrer deg først."
    """
    print("\n" + "="*50)
    print("TEST SCENARIO 2: Login with Non-Existent Email")
    print("="*50)
    
    try:
        nonexistent_email = "doesnotexist@test.com"
        login_data = {"email": nonexistent_email}
        
        print(f"Step 1: Attempting login with non-existent email: {nonexistent_email}")
        login_response = requests.post(f"{API_BASE}/owners/login", json=login_data)
        
        # Should return 404
        if login_response.status_code != 404:
            results.add_fail("Scenario 2 - Status Code", 
                           f"Expected 404, got {login_response.status_code}")
            return False
        
        print(f"✅ Correct status code: 404")
        
        # Verify error message
        try:
            error_data = login_response.json()
            expected_message = "Ingen eierportal funnet. Vennligst registrer deg først."
            
            if 'detail' not in error_data:
                results.add_fail("Scenario 2 - Error Structure", "Missing 'detail' field in error response")
                return False
            
            if error_data['detail'] != expected_message:
                results.add_fail("Scenario 2 - Error Message", 
                               f"Expected: '{expected_message}', Got: '{error_data['detail']}'")
                return False
            
            print(f"✅ Correct Norwegian error message: '{error_data['detail']}'")
            
        except json.JSONDecodeError:
            results.add_fail("Scenario 2 - Response Format", "Response is not valid JSON")
            return False
        
        results.add_pass("Scenario 2 - Login with Non-Existent Email")
        return True
        
    except Exception as e:
        results.add_fail("Scenario 2 - Exception", f"Error: {str(e)}")
        return False

def test_scenario_3_duplicate_registration():
    """
    Test Scenario 3: Duplicate Registration
    1. Use an existing email from the database (e.g., "njaleliasson@gmail.com")
    2. Try to POST to /api/owner-portal with this email
    3. Verify response is 400 with message about owner already existing
    """
    print("\n" + "="*50)
    print("TEST SCENARIO 3: Duplicate Registration")
    print("="*50)
    
    try:
        # First, create a test owner to ensure we have an existing email
        test_timestamp = int(time.time())
        existing_email = f"existing{test_timestamp}@test.com"
        
        initial_owner_data = {
            "email": existing_email,
            "name": "Initial User",
            "address": "Initial Address 123",
            "phone": "+47 11111111",
            "password": "initial123"
        }
        
        print(f"Step 1: Creating initial owner with email: {existing_email}")
        initial_response = requests.post(f"{API_BASE}/owner-portal", json=initial_owner_data)
        
        if initial_response.status_code != 200:
            results.add_fail("Scenario 3 - Initial Setup", 
                           f"Failed to create initial owner: {initial_response.status_code}")
            return False
        
        print(f"✅ Initial owner created successfully")
        
        # Step 2: Try to create another owner with the same email
        duplicate_owner_data = {
            "email": existing_email,  # Same email
            "name": "Duplicate User",
            "address": "Duplicate Address 456",
            "phone": "+47 22222222",
            "password": "duplicate123"
        }
        
        print(f"Step 2: Attempting duplicate registration with same email: {existing_email}")
        duplicate_response = requests.post(f"{API_BASE}/owner-portal", json=duplicate_owner_data)
        
        # Should return 400
        if duplicate_response.status_code != 400:
            results.add_fail("Scenario 3 - Status Code", 
                           f"Expected 400, got {duplicate_response.status_code}")
            return False
        
        print(f"✅ Correct status code: 400")
        
        # Step 3: Verify error message about owner already existing
        try:
            error_data = duplicate_response.json()
            
            if 'detail' not in error_data:
                results.add_fail("Scenario 3 - Error Structure", "Missing 'detail' field in error response")
                return False
            
            error_message = error_data['detail']
            
            # Check if the error message indicates owner already exists
            if "already exists" not in error_message.lower() and "portal already exists" not in error_message.lower():
                results.add_fail("Scenario 3 - Error Message", 
                               f"Error message doesn't indicate duplicate: '{error_message}'")
                return False
            
            print(f"✅ Correct error message about existing owner: '{error_message}'")
            
        except json.JSONDecodeError:
            results.add_fail("Scenario 3 - Response Format", "Response is not valid JSON")
            return False
        
        results.add_pass("Scenario 3 - Duplicate Registration Prevention")
        return True
        
    except Exception as e:
        results.add_fail("Scenario 3 - Exception", f"Error: {str(e)}")
        return False

def run_authentication_flow_tests():
    """Run all authentication flow test scenarios"""
    print("Starting DigiHome Owner Authentication Flow Tests...")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    
    # Test API connectivity first
    try:
        response = requests.get(f"{API_BASE}/")
        if response.status_code != 200:
            print("❌ API is not accessible. Stopping tests.")
            return False
        print("✅ API connectivity confirmed")
    except Exception as e:
        print(f"❌ API connectivity failed: {str(e)}")
        return False
    
    # Run all test scenarios
    test_scenario_1_new_user_registration_and_login()
    test_scenario_2_login_nonexistent_email()
    test_scenario_3_duplicate_registration()
    
    return results.summary()

if __name__ == "__main__":
    success = run_authentication_flow_tests()
    exit(0 if success else 1)