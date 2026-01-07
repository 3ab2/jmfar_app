#!/bin/bash

# Test Evenement File Handling API

BASE_URL="http://localhost:8000/api"

echo "=== Testing Evenement File Handling API ==="
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Create an evenement
echo "1. Creating evenement..."
EVENEMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/evenements" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "TEST_'$(date +%s)'",
    "date_evenement": "'$(date -I)'",
    "titre": "Test Evenement for File Upload",
    "description": "This is a test evenement for file upload functionality",
    "utilisateur_id": 1,
    "type_evenement_id": 1
  }')

echo "Response: $EVENEMENT_RESPONSE"
EVENEMENT_ID=$(echo $EVENEMENT_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Evenement ID: $EVENEMENT_ID"
echo ""

# Test 2: Get evenement with files
echo "2. Getting evenement details..."
curl -s -X GET "$BASE_URL/evenements/$EVENEMENT_ID" | jq '.'
echo ""

# Test 3: Create a test file and upload it
echo "3. Creating test file..."
echo "This is a test file for upload" > /tmp/test_file.txt
echo "Test file created: /tmp/test_file.txt"

echo "4. Uploading file to evenement..."
UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/evenements/$EVENEMENT_ID/files" \
  -F "files=@/tmp/test_file.txt")

echo "Upload Response: $UPLOAD_RESPONSE"
echo ""

# Test 5: Get evenement again to see attached files
echo "5. Getting evenement details with files..."
curl -s -X GET "$BASE_URL/evenements/$EVENEMENT_ID" | jq '.fichiers'
echo ""

# Test 6: List all evenements
echo "6. Listing all evenements..."
curl -s -X GET "$BASE_URL/evenements" | jq '.[0] | {id, titre, fichiers}'
echo ""

# Cleanup
echo "7. Cleaning up..."
rm -f /tmp/test_file.txt
echo "Test file removed"

echo ""
echo "=== API Test Complete ==="
