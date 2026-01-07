# Test Evenement File Handling API

$baseUrl = 'http://127.0.0.1:8000/api'

Write-Host '=== Testing Evenement File Handling API ==='
Write-Host "Base URL: $baseUrl"
Write-Host ''

# Test 1: Create an evenement
Write-Host '1. Creating evenement...'
$reference = 'TEST_' + [int][double]::Parse((Get-Date -UFormat %s))
$body = @{
    reference = $reference
    date_evenement = (Get-Date).ToString('yyyy-MM-dd')
    titre = 'Test Evenement for File Upload'
    description = 'This is a test evenement for file upload functionality'
    utilisateur_id = 1
    type_evenement_id = 1
    pays_id = 1
    ville_id = 1
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/evenements" -Method Post -ContentType 'application/json' -Body $body
    Write-Host "Evenement created with ID: $($response.id)"
    $evenementId = $response.id
} catch {
    Write-Host "Error creating evenement: $($_.Exception.Message)"
    exit 1
}

Write-Host ''

# Test 2: Get evenement with files
Write-Host '2. Getting evenement details...'
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/evenements/$evenementId" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error getting evenement: $($_.Exception.Message)"
}
Write-Host ''

# Test 3: Create a test file and upload it
Write-Host '3. Creating test file...'
$testFilePath = "$env:TEMP\test_file.txt"
"This is a test file for upload" | Out-File -FilePath $testFilePath -Encoding UTF8
Write-Host "Test file created: $testFilePath"

Write-Host '4. Uploading file to evenement...'
try {
    $fileContent = Get-Content $testFilePath -Raw
    $fileBytes = [System.Text.Encoding]::UTF8.GetBytes($fileContent)
    $fileStream = [System.IO.MemoryStream]::new($fileBytes)
    $fileForm = [System.Net.Http.StreamContent]::new($fileStream)
    
    $multipartContent = [System.Net.Http.MultipartFormDataContent]::new()
    $multipartContent.Add($fileForm, 'files', 'test_file.txt')
    
    $httpClient = [System.Net.Http.HttpClient]::new()
    $response = $httpClient.PostAsync("$baseUrl/evenements/$evenementId/files", $multipartContent).Result
    $responseContent = $response.Content.ReadAsStringAsync().Result
    
    Write-Host "Upload Response: $responseContent"
} catch {
    Write-Host "Error uploading file: $($_.Exception.Message)"
}
Write-Host ''

# Test 5: Get evenement again to see attached files
Write-Host '5. Getting evenement details with files...'
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/evenements/$evenementId" -Method Get
    $response.fichiers | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error getting evenement with files: $($_.Exception.Message)"
}
Write-Host ''

# Cleanup
Write-Host '6. Cleaning up...'
Remove-Item $testFilePath -ErrorAction SilentlyContinue
Write-Host "Test file removed"

Write-Host ''
Write-Host '=== API Test Complete ==='
