@echo off
REM Test Evenement File Handling API using curl

set BASE_URL=http://127.0.0.1:8000/api

echo === Testing Evenement File Handling API ===
echo Base URL: %BASE_URL%
echo.

REM Test 1: Create an evenement
echo 1. Creating evenement...
set TIMESTAMP=%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
curl -s -X POST "%BASE_URL%/evenements" -H "Content-Type: application/json" -d "{\"reference\": \"TEST_%TIMESTAMP%\", \"date_evenement\": \"2026-01-07\", \"titre\": \"Test Evenement for File Upload\", \"description\": \"This is a test evenement for file upload functionality\", \"utilisateur_id\": 1, \"type_evenement_id\": 1, \"pays_id\": 1, \"ville_id\": 1}" > evenement_response.json
type evenement_response.json
echo.

REM Test 2: Get evenement details
echo 2. Getting evenement details...
curl -s -X GET "%BASE_URL%/evenements/1" > evenement_details.json
type evenement_details.json
echo.

REM Test 3: Create test file
echo 3. Creating test file...
echo This is a test file for upload > %TEMP%\test_file.txt
echo Test file created: %TEMP%\test_file.txt

REM Test 4: Upload file (this might not work in Windows curl, but let's try)
echo 4. Uploading file to evenement...
curl -X POST "%BASE_URL%/evenements/1/files" -F "files=@%TEMP%\test_file.txt"
echo.

REM Test 5: Get evenement with files
echo 5. Getting evenement details with files...
curl -s -X GET "%BASE_URL%/evenements/1" > evenement_with_files.json
type evenement_with_files.json
echo.

REM Cleanup
echo 6. Cleaning up...
del %TEMP%\test_file.txt 2>nul
del evenement_response.json 2>nul
del evenement_details.json 2>nul
del evenement_with_files.json 2>nul
echo Test files removed

echo.
echo === API Test Complete ===
pause
