#!/usr/bin/env python3
"""
DigiHome Comprehensive Authentication, Onboarding, and Admin Flow Testing Suite
Tests all flows as requested in the review request
"""

import requests
import json
import uuid
import time
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://property-onboard-1.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"🔍 COMPREHENSIVE DIGIHOME TESTING SUITE")
print(f"Backend URL: {BACKEND_URL}")
print(f"API Base: {API_BASE}")
print("=" * 80)

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        self.critical_errors = []
    
    def add_pass(self, test_name):
        self.passed += 1
        print(f"✅ PASS: {test_name}")
    
    def add_fail(self, test_name, error, critical=False):
        self.failed += 1
        error_msg = f"{test_name}: {error}"
        self.errors.append(error_msg)
        if critical:
            self.critical_errors.append(error_msg)
        print(f"❌ FAIL: {test_name} - {error}")
    
    def summary(self):
        print("\n" + "=" * 80)
        print(f"🎯 FINAL TEST SUMMARY: {self.passed} passed, {self.failed} failed")
        if self.critical_errors:
            print(f"\n🚨 CRITICAL FAILURES ({len(self.critical_errors)}):")
            for error in self.critical_errors:
                print(f"  ⚠️  {error}")
        if self.errors and not self.critical_errors:
            print("\n📋 ALL FAILURES:")
            for error in self.errors:
                print(f"  - {error}")
        return self.failed == 0

results = TestResults()

# Generate unique test data for each test run
test_timestamp = int(time.time())
test_uuid = str(uuid.uuid4())[:8]

print(f"🔧 Test Session ID: {test_uuid}")
print(f"🕐 Test Timestamp: {test_timestamp}")
print()

# ============================================================================
# TEST SUITE 1: NEW USER SIGN UP FLOW
# ============================================================================

def test_suite_1_new_user_signup():
    """TEST SUITE 1: NEW USER SIGN UP FLOW"""
    print("🧪 TEST SUITE 1: NEW USER SIGN UP FLOW")
    print("-" * 50)
    
    # Unique test data for this suite
    unique_email = f"newuser.{test_uuid}@digihome.no"
    
    lead_data = {
        "address": "Storgata 42, 0184 Oslo, Norway",
        "name": "Magnus Eriksen",
        "phone": "+47 123 45 678",
        "email": unique_email
    }
    
    owner_data = {
        "address": "Storgata 42, 0184 Oslo, Norway",
        "name": "Magnus Eriksen", 
        "phone": "+47 123 45 678",
        "email": unique_email,
        "password": "SecurePass2024!"
    }
    
    try:
        # Step 1: Create a new lead via POST /api/leads
        print("Step 1: Creating new lead...")
        lead_response = requests.post(f"{API_BASE}/leads", json=lead_data)
        
        if lead_response.status_code != 200:
            results.add_fail("Suite 1 - Lead Creation", f"Status: {lead_response.status_code}, Response: {lead_response.text}", critical=True)
            return False
        
        lead_result = lead_response.json()
        lead_id = lead_result['id']
        
        # Verify lead has unique ID and correct status
        if not lead_result.get('id') or lead_result.get('status') != 'new':
            results.add_fail("Suite 1 - Lead Validation", f"Invalid lead data: {lead_result}", critical=True)
            return False
        
        results.add_pass("Suite 1.1 - Lead creation with unique email")
        
        # Step 2: Create owner portal via POST /api/owner-portal with same email
        print("Step 2: Creating owner portal...")
        owner_response = requests.post(f"{API_BASE}/owner-portal", json=owner_data)
        
        if owner_response.status_code != 200:
            results.add_fail("Suite 1 - Owner Portal Creation", f"Status: {owner_response.status_code}, Response: {owner_response.text}", critical=True)
            return False
        
        owner_result = owner_response.json()
        owner_id = owner_result['id']
        
        # Step 3: Verify owner is created successfully with unique ID
        if not owner_result.get('id'):
            results.add_fail("Suite 1 - Owner ID Validation", "Owner ID missing", critical=True)
            return False
        
        try:
            uuid.UUID(owner_id)
        except ValueError:
            results.add_fail("Suite 1 - Owner UUID Validation", f"Invalid UUID: {owner_id}", critical=True)
            return False
        
        results.add_pass("Suite 1.2 - Owner portal creation with unique ID")
        
        # Step 4: Verify lead status is updated to "converted"
        print("Step 3: Verifying lead status conversion...")
        lead_check_response = requests.get(f"{API_BASE}/leads/{lead_id}")
        
        if lead_check_response.status_code != 200:
            results.add_fail("Suite 1 - Lead Status Check", f"Cannot fetch lead: {lead_check_response.status_code}", critical=True)
            return False
        
        updated_lead = lead_check_response.json()
        if updated_lead.get('status') != 'converted':
            results.add_fail("Suite 1 - Lead Status Conversion", f"Expected 'converted', got '{updated_lead.get('status')}'", critical=True)
            return False
        
        results.add_pass("Suite 1.3 - Lead status updated to 'converted'")
        
        # Step 5: Test that duplicate email registration returns 400 error
        print("Step 4: Testing duplicate email registration...")
        duplicate_response = requests.post(f"{API_BASE}/owner-portal", json=owner_data)
        
        if duplicate_response.status_code != 400:
            results.add_fail("Suite 1 - Duplicate Email Prevention", f"Expected 400, got {duplicate_response.status_code}", critical=True)
            return False
        
        results.add_pass("Suite 1.4 - Duplicate email registration returns 400 error")
        
        print("✅ TEST SUITE 1 COMPLETED SUCCESSFULLY")
        return True, owner_id, unique_email
        
    except Exception as e:
        results.add_fail("Suite 1 - Exception", f"Error: {str(e)}", critical=True)
        return False, None, None

# ============================================================================
# TEST SUITE 2: USER LOGIN FLOW
# ============================================================================

def test_suite_2_user_login(owner_email):
    """TEST SUITE 2: USER LOGIN FLOW"""
    print("\n🧪 TEST SUITE 2: USER LOGIN FLOW")
    print("-" * 40)
    
    try:
        # Step 1: Test login with existing owner email
        print("Step 1: Testing login with existing owner...")
        login_data = {"email": owner_email}
        login_response = requests.post(f"{API_BASE}/owners/login", json=login_data)
        
        if login_response.status_code != 200:
            results.add_fail("Suite 2 - Existing Owner Login", f"Status: {login_response.status_code}, Response: {login_response.text}", critical=True)
            return False
        
        login_result = login_response.json()
        
        # Step 2: Verify correct owner data is returned (id, name, email, address)
        required_fields = ['id', 'name', 'email', 'address']
        missing_fields = [field for field in required_fields if field not in login_result]
        
        if missing_fields:
            results.add_fail("Suite 2 - Login Response Structure", f"Missing fields: {missing_fields}", critical=True)
            return False
        
        # Step 3: Verify password_hash is NOT exposed in response
        if 'password_hash' in login_result:
            results.add_fail("Suite 2 - Security Breach", "password_hash exposed in login response", critical=True)
            return False
        
        results.add_pass("Suite 2.1 - Login with existing owner (secure response)")
        
        # Step 4: Test login with non-existent email returns 404 with Norwegian error message
        print("Step 2: Testing login with non-existent email...")
        nonexistent_data = {"email": "doesnotexist@digihome.no"}
        nonexistent_response = requests.post(f"{API_BASE}/owners/login", json=nonexistent_data)
        
        if nonexistent_response.status_code != 404:
            results.add_fail("Suite 2 - Non-existent Email", f"Expected 404, got {nonexistent_response.status_code}", critical=True)
            return False
        
        error_response = nonexistent_response.json()
        norwegian_message = "Ingen eierportal funnet. Vennligst registrer deg først."
        if norwegian_message not in error_response.get('detail', ''):
            results.add_fail("Suite 2 - Norwegian Error Message", f"Expected Norwegian message, got: {error_response.get('detail')}")
            return False
        
        results.add_pass("Suite 2.2 - Non-existent email returns 404 with Norwegian message")
        
        # Step 5: Test login with invalid email format
        print("Step 3: Testing login with invalid email format...")
        invalid_data = {"email": "invalid-email-format"}
        invalid_response = requests.post(f"{API_BASE}/owners/login", json=invalid_data)
        
        # Should return 404 (owner not found) since invalid emails won't match any records
        if invalid_response.status_code not in [404, 422]:
            results.add_fail("Suite 2 - Invalid Email Format", f"Expected 404 or 422, got {invalid_response.status_code}")
            return False
        
        results.add_pass("Suite 2.3 - Invalid email format handled correctly")
        
        print("✅ TEST SUITE 2 COMPLETED SUCCESSFULLY")
        return True
        
    except Exception as e:
        results.add_fail("Suite 2 - Exception", f"Error: {str(e)}", critical=True)
        return False

# ============================================================================
# TEST SUITE 3: ONBOARDING DATA FLOW
# ============================================================================

def test_suite_3_onboarding_flow(owner_id):
    """TEST SUITE 3: ONBOARDING DATA FLOW"""
    print("\n🧪 TEST SUITE 3: ONBOARDING DATA FLOW")
    print("-" * 45)
    
    # Complete onboarding data as specified in the review
    onboarding_data = {
        "address": "Testveien 456",
        "city": "Bergen",
        "unit": "H0402",
        "property_type": "apartment",
        "ownership_type": "selveier",
        "rental_strategy": "airbnb",
        "start_date": "2025-12-01",
        "end_date": None,
        "rooms": {
            "living": [
                {
                    "id": 201,
                    "type": "living",
                    "furniture": [
                        {"id": 1, "type": "sofa", "details": {"seats": 4}},
                        {"id": 2, "type": "tv", "details": {"size": 55}}
                    ]
                }
            ],
            "bedroom": [
                {
                    "id": 202,
                    "type": "bedroom", 
                    "furniture": [
                        {"id": 3, "type": "bed", "details": {"width": 180}},
                        {"id": 4, "type": "wardrobe", "details": {"doors": 3}}
                    ]
                }
            ],
            "bathroom": [
                {
                    "id": 203,
                    "type": "bathroom",
                    "amenities": ["dusj", "toalett", "servant"]
                }
            ]
        },
        "facilities": ["balkong", "heis", "tørketrommel"],
        "parking": "garage",
        "photography": "professional",
        "cleaning": "service"
    }
    
    try:
        # Step 1: Submit onboarding data via PUT /api/owners/{owner_id}/onboarding
        print("Step 1: Submitting complete onboarding data...")
        onboarding_response = requests.put(f"{API_BASE}/owners/{owner_id}/onboarding", json=onboarding_data)
        
        if onboarding_response.status_code != 200:
            results.add_fail("Suite 3 - Onboarding Submission", f"Status: {onboarding_response.status_code}, Response: {onboarding_response.text}", critical=True)
            return False
        
        onboarding_result = onboarding_response.json()
        if "successfully" not in onboarding_result.get('message', '').lower():
            results.add_fail("Suite 3 - Onboarding Response", f"Unexpected response: {onboarding_result}")
            return False
        
        results.add_pass("Suite 3.1 - Complete onboarding data submission")
        
        # Step 2: Verify onboarding_completed flag is set to true
        print("Step 2: Verifying onboarding completion flag...")
        owner_check_response = requests.get(f"{API_BASE}/owners/{owner_id}")
        
        if owner_check_response.status_code != 200:
            results.add_fail("Suite 3 - Owner Data Retrieval", f"Status: {owner_check_response.status_code}", critical=True)
            return False
        
        updated_owner = owner_check_response.json()
        
        if not updated_owner.get('onboarding_completed'):
            results.add_fail("Suite 3 - Onboarding Completion Flag", f"onboarding_completed is {updated_owner.get('onboarding_completed')}", critical=True)
            return False
        
        results.add_pass("Suite 3.2 - onboarding_completed flag set to true")
        
        # Step 3: Retrieve owner data and verify all onboarding_data is stored correctly
        print("Step 3: Verifying onboarding data storage...")
        saved_data = updated_owner.get('onboarding_data', {})
        
        # Verify all required fields are present
        required_fields = ['address', 'city', 'unit', 'property_type', 'ownership_type', 'rental_strategy', 'rooms', 'facilities', 'parking', 'photography', 'cleaning']
        missing_fields = [field for field in required_fields if field not in saved_data]
        
        if missing_fields:
            results.add_fail("Suite 3 - Data Completeness", f"Missing fields: {missing_fields}", critical=True)
            return False
        
        # Verify specific data values
        verification_checks = [
            ('city', 'Bergen'),
            ('unit', 'H0402'),
            ('property_type', 'apartment'),
            ('ownership_type', 'selveier'),
            ('rental_strategy', 'airbnb'),
            ('parking', 'garage'),
            ('photography', 'professional'),
            ('cleaning', 'service')
        ]
        
        for field, expected_value in verification_checks:
            if saved_data.get(field) != expected_value:
                results.add_fail("Suite 3 - Data Integrity", f"{field}: expected '{expected_value}', got '{saved_data.get(field)}'", critical=True)
                return False
        
        # Verify rooms structure
        rooms = saved_data.get('rooms', {})
        required_room_types = ['living', 'bedroom', 'bathroom']
        missing_rooms = [room_type for room_type in required_room_types if room_type not in rooms]
        
        if missing_rooms:
            results.add_fail("Suite 3 - Rooms Structure", f"Missing room types: {missing_rooms}", critical=True)
            return False
        
        # Verify facilities
        facilities = saved_data.get('facilities', [])
        expected_facilities = ['balkong', 'heis', 'tørketrommel']
        missing_facilities = [facility for facility in expected_facilities if facility not in facilities]
        
        if missing_facilities:
            results.add_fail("Suite 3 - Facilities Data", f"Missing facilities: {missing_facilities}", critical=True)
            return False
        
        results.add_pass("Suite 3.3 - All onboarding data stored correctly")
        
        # Step 4: Test updating onboarding data multiple times
        print("Step 4: Testing onboarding data updates...")
        updated_onboarding_data = onboarding_data.copy()
        updated_onboarding_data['city'] = 'Trondheim'
        updated_onboarding_data['parking'] = 'free'
        
        update_response = requests.put(f"{API_BASE}/owners/{owner_id}/onboarding", json=updated_onboarding_data)
        
        if update_response.status_code != 200:
            results.add_fail("Suite 3 - Onboarding Update", f"Status: {update_response.status_code}", critical=True)
            return False
        
        # Verify updates were saved
        final_check_response = requests.get(f"{API_BASE}/owners/{owner_id}")
        final_owner = final_check_response.json()
        final_data = final_owner.get('onboarding_data', {})
        
        if final_data.get('city') != 'Trondheim' or final_data.get('parking') != 'free':
            results.add_fail("Suite 3 - Data Update Verification", f"Updates not saved correctly", critical=True)
            return False
        
        results.add_pass("Suite 3.4 - Onboarding data updates work correctly")
        
        print("✅ TEST SUITE 3 COMPLETED SUCCESSFULLY")
        return True
        
    except Exception as e:
        results.add_fail("Suite 3 - Exception", f"Error: {str(e)}", critical=True)
        return False

# ============================================================================
# TEST SUITE 4: ADMIN DASHBOARD FLOWS
# ============================================================================

def test_suite_4_admin_dashboard(owner_id):
    """TEST SUITE 4: ADMIN DASHBOARD FLOWS"""
    print("\n🧪 TEST SUITE 4: ADMIN DASHBOARD FLOWS")
    print("-" * 45)
    
    try:
        # Step 1: Get all owners via GET /api/owners and /api/owner-portal/all
        print("Step 1: Testing admin owner list endpoints...")
        
        # Test both endpoints
        endpoints = ["/api/owners", "/api/owner-portal/all"]
        
        for endpoint in endpoints:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            
            if response.status_code != 200:
                results.add_fail(f"Suite 4 - Admin List ({endpoint})", f"Status: {response.status_code}", critical=True)
                return False
            
            owners_list = response.json()
            
            if not isinstance(owners_list, list):
                results.add_fail(f"Suite 4 - Response Format ({endpoint})", f"Expected list, got {type(owners_list)}", critical=True)
                return False
            
            # Step 2: Verify password hashes are NOT exposed in list response
            for owner in owners_list:
                if 'password_hash' in owner:
                    results.add_fail(f"Suite 4 - Security Breach ({endpoint})", "password_hash exposed in admin list", critical=True)
                    return False
        
        results.add_pass("Suite 4.1 - Admin owner lists (secure, no password hashes)")
        
        # Step 3: Get specific owner by ID via GET /api/owners/{owner_id}
        print("Step 2: Testing specific owner retrieval...")
        owner_response = requests.get(f"{API_BASE}/owners/{owner_id}")
        
        if owner_response.status_code != 200:
            results.add_fail("Suite 4 - Specific Owner Retrieval", f"Status: {owner_response.status_code}", critical=True)
            return False
        
        owner_data = owner_response.json()
        
        if 'password_hash' in owner_data:
            results.add_fail("Suite 4 - Individual Owner Security", "password_hash exposed in individual owner response", critical=True)
            return False
        
        results.add_pass("Suite 4.2 - Specific owner retrieval (secure)")
        
        # Step 4: Update owner status via PUT /api/owners/{owner_id}/status
        print("Step 3: Testing owner status updates...")
        
        valid_statuses = ["Ringt", "Sendt tilbud", "Onboarding", "Kontrakt", "Lost"]
        
        for status in valid_statuses:
            status_data = {"status": status}
            status_response = requests.put(f"{API_BASE}/owners/{owner_id}/status", json=status_data)
            
            if status_response.status_code != 200:
                results.add_fail(f"Suite 4 - Status Update ({status})", f"Status: {status_response.status_code}", critical=True)
                return False
            
            status_result = status_response.json()
            if status_result.get('status') != status:
                results.add_fail(f"Suite 4 - Status Verification ({status})", f"Status not updated correctly", critical=True)
                return False
        
        results.add_pass("Suite 4.3 - All valid status updates work")
        
        # Step 5: Verify invalid status returns 400 error
        print("Step 4: Testing invalid status rejection...")
        invalid_status_data = {"status": "InvalidStatus"}
        invalid_response = requests.put(f"{API_BASE}/owners/{owner_id}/status", json=invalid_status_data)
        
        if invalid_response.status_code != 400:
            results.add_fail("Suite 4 - Invalid Status Rejection", f"Expected 400, got {invalid_response.status_code}", critical=True)
            return False
        
        results.add_pass("Suite 4.4 - Invalid status returns 400 error")
        
        # Step 6: Test getting non-existent owner returns 404
        print("Step 5: Testing non-existent owner handling...")
        fake_owner_id = str(uuid.uuid4())
        nonexistent_response = requests.get(f"{API_BASE}/owners/{fake_owner_id}")
        
        if nonexistent_response.status_code != 404:
            results.add_fail("Suite 4 - Non-existent Owner", f"Expected 404, got {nonexistent_response.status_code}", critical=True)
            return False
        
        results.add_pass("Suite 4.5 - Non-existent owner returns 404")
        
        print("✅ TEST SUITE 4 COMPLETED SUCCESSFULLY")
        return True
        
    except Exception as e:
        results.add_fail("Suite 4 - Exception", f"Error: {str(e)}", critical=True)
        return False

# ============================================================================
# TEST SUITE 5: LEAD MANAGEMENT
# ============================================================================

def test_suite_5_lead_management():
    """TEST SUITE 5: LEAD MANAGEMENT"""
    print("\n🧪 TEST SUITE 5: LEAD MANAGEMENT")
    print("-" * 40)
    
    try:
        # Step 1: Get all leads via GET /api/leads
        print("Step 1: Testing lead management...")
        leads_response = requests.get(f"{API_BASE}/leads")
        
        if leads_response.status_code != 200:
            results.add_fail("Suite 5 - Get All Leads", f"Status: {leads_response.status_code}", critical=True)
            return False
        
        leads_list = leads_response.json()
        
        if not isinstance(leads_list, list):
            results.add_fail("Suite 5 - Leads Response Format", f"Expected list, got {type(leads_list)}", critical=True)
            return False
        
        results.add_pass("Suite 5.1 - Get all leads works correctly")
        
        # Step 2: Verify leads have correct status tracking
        print("Step 2: Verifying lead status tracking...")
        
        status_counts = {}
        for lead in leads_list:
            status = lead.get('status', 'unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
            
            # Verify each lead has required fields
            required_fields = ['id', 'email', 'status', 'created_at']
            missing_fields = [field for field in required_fields if field not in lead]
            
            if missing_fields:
                results.add_fail("Suite 5 - Lead Structure", f"Lead missing fields: {missing_fields}", critical=True)
                return False
        
        results.add_pass("Suite 5.2 - Lead status tracking and structure correct")
        
        # Step 3: Test that converted leads have "converted" status
        print("Step 3: Verifying converted leads...")
        converted_leads = [lead for lead in leads_list if lead.get('status') == 'converted']
        
        if not converted_leads:
            results.add_fail("Suite 5 - Converted Leads", "No converted leads found (expected from previous tests)")
            return False
        
        # Verify converted leads have proper structure
        for lead in converted_leads:
            if not lead.get('email') or not lead.get('id'):
                results.add_fail("Suite 5 - Converted Lead Structure", f"Invalid converted lead: {lead}")
                return False
        
        results.add_pass("Suite 5.3 - Converted leads have correct status")
        
        print(f"📊 Lead Status Summary: {status_counts}")
        print("✅ TEST SUITE 5 COMPLETED SUCCESSFULLY")
        return True
        
    except Exception as e:
        results.add_fail("Suite 5 - Exception", f"Error: {str(e)}", critical=True)
        return False

# ============================================================================
# SECURITY CHECKS
# ============================================================================

def test_security_checks():
    """SECURITY CHECKS"""
    print("\n🔒 SECURITY CHECKS")
    print("-" * 25)
    
    try:
        # Create a test owner for security testing
        security_test_email = f"security.test.{test_uuid}@digihome.no"
        security_owner_data = {
            "address": "Security Test Address",
            "name": "Security Tester",
            "phone": "+47 999 88 777",
            "email": security_test_email,
            "password": "SecurityTest123!"
        }
        
        # Create owner for security testing
        owner_response = requests.post(f"{API_BASE}/owner-portal", json=security_owner_data)
        if owner_response.status_code != 200:
            results.add_fail("Security - Test Owner Creation", f"Could not create test owner: {owner_response.status_code}")
            return False
        
        owner_data = owner_response.json()
        owner_id = owner_data['id']
        
        # Security Check 1: Verify no password hashes in any API response
        print("Security Check 1: Password hash exposure...")
        
        endpoints_to_check = [
            f"/api/owners",
            f"/api/owner-portal/all", 
            f"/api/owners/{owner_id}"
        ]
        
        for endpoint in endpoints_to_check:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            if response.status_code == 200:
                data = response.json()
                
                # Check if it's a list or single object
                items_to_check = data if isinstance(data, list) else [data]
                
                for item in items_to_check:
                    if 'password_hash' in item:
                        results.add_fail("Security - Password Hash Exposure", f"password_hash found in {endpoint}", critical=True)
                        return False
        
        # Also check login response
        login_response = requests.post(f"{API_BASE}/owners/login", json={"email": security_test_email})
        if login_response.status_code == 200:
            login_data = login_response.json()
            if 'password_hash' in login_data:
                results.add_fail("Security - Login Password Hash", "password_hash exposed in login response", critical=True)
                return False
        
        results.add_pass("Security Check 1 - No password hashes in API responses")
        
        # Security Check 2: Verify proper error messages (in Norwegian where applicable)
        print("Security Check 2: Error message localization...")
        
        nonexistent_login = requests.post(f"{API_BASE}/owners/login", json={"email": "nonexistent@test.com"})
        if nonexistent_login.status_code == 404:
            error_detail = nonexistent_login.json().get('detail', '')
            if 'Ingen eierportal funnet' not in error_detail:
                results.add_fail("Security - Norwegian Error Messages", f"Expected Norwegian error, got: {error_detail}")
                return False
        
        results.add_pass("Security Check 2 - Proper Norwegian error messages")
        
        # Security Check 3: Verify proper HTTP status codes
        print("Security Check 3: HTTP status codes...")
        
        status_code_tests = [
            # (method, endpoint, data, expected_status, description)
            ('GET', f'/api/owners/{owner_id}', None, 200, 'Valid owner retrieval'),
            ('GET', f'/api/owners/{str(uuid.uuid4())}', None, 404, 'Non-existent owner'),
            ('POST', '/api/owners/login', {'email': 'nonexistent@test.com'}, 404, 'Non-existent login'),
            ('POST', '/api/leads', {'name': 'Test'}, 422, 'Invalid lead data'),
            ('PUT', f'/api/owners/{owner_id}/status', {'status': 'InvalidStatus'}, 400, 'Invalid status'),
        ]
        
        for method, endpoint, data, expected_status, description in status_code_tests:
            if method == 'GET':
                response = requests.get(f"{BACKEND_URL}{endpoint}")
            elif method == 'POST':
                response = requests.post(f"{BACKEND_URL}{endpoint}", json=data)
            elif method == 'PUT':
                response = requests.put(f"{BACKEND_URL}{endpoint}", json=data)
            
            if response.status_code != expected_status:
                results.add_fail(f"Security - Status Code ({description})", f"Expected {expected_status}, got {response.status_code}")
                return False
        
        results.add_pass("Security Check 3 - Proper HTTP status codes")
        
        # Security Check 4: Check that all required fields are validated
        print("Security Check 4: Field validation...")
        
        # Test missing required fields in lead creation
        incomplete_lead = requests.post(f"{API_BASE}/leads", json={"name": "Incomplete"})
        if incomplete_lead.status_code != 422:
            results.add_fail("Security - Lead Validation", f"Expected 422 for incomplete lead, got {incomplete_lead.status_code}")
            return False
        
        # Test missing password in owner creation
        incomplete_owner = {
            "address": "Test Address",
            "name": "Test Name",
            "phone": "12345678",
            "email": "test@example.com"
            # Missing password
        }
        incomplete_owner_response = requests.post(f"{API_BASE}/owner-portal", json=incomplete_owner)
        if incomplete_owner_response.status_code != 422:
            results.add_fail("Security - Owner Validation", f"Expected 422 for incomplete owner, got {incomplete_owner_response.status_code}")
            return False
        
        results.add_pass("Security Check 4 - Required field validation")
        
        print("✅ ALL SECURITY CHECKS PASSED")
        return True
        
    except Exception as e:
        results.add_fail("Security Checks - Exception", f"Error: {str(e)}", critical=True)
        return False

# ============================================================================
# MAIN TEST EXECUTION
# ============================================================================

def run_comprehensive_tests():
    """Run all comprehensive tests as requested in the review"""
    print("🚀 STARTING COMPREHENSIVE DIGIHOME TESTING")
    print("=" * 80)
    
    # Test API connectivity first
    try:
        api_response = requests.get(f"{API_BASE}/")
        if api_response.status_code != 200:
            results.add_fail("API Connectivity", f"API not accessible: {api_response.status_code}", critical=True)
            return False
        results.add_pass("API Connectivity Check")
    except Exception as e:
        results.add_fail("API Connectivity", f"Connection error: {str(e)}", critical=True)
        return False
    
    # Run all test suites
    suite_1_success, owner_id, owner_email = test_suite_1_new_user_signup()
    if not suite_1_success:
        print("❌ Suite 1 failed, stopping tests")
        return False
    
    suite_2_success = test_suite_2_user_login(owner_email)
    if not suite_2_success:
        print("❌ Suite 2 failed, stopping tests")
        return False
    
    suite_3_success = test_suite_3_onboarding_flow(owner_id)
    if not suite_3_success:
        print("❌ Suite 3 failed, stopping tests")
        return False
    
    suite_4_success = test_suite_4_admin_dashboard(owner_id)
    if not suite_4_success:
        print("❌ Suite 4 failed, stopping tests")
        return False
    
    suite_5_success = test_suite_5_lead_management()
    if not suite_5_success:
        print("❌ Suite 5 failed, stopping tests")
        return False
    
    security_success = test_security_checks()
    if not security_success:
        print("❌ Security checks failed")
        return False
    
    return results.summary()

if __name__ == "__main__":
    success = run_comprehensive_tests()
    exit(0 if success else 1)