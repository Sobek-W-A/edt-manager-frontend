# Variables
$REPO_URL = $args[0]
$FOLDER_NAME = "edt-manager-backend"

if (-Not $REPO_URL) {
    Write-Host "[ERROR] - No repository was indicated. Impossible to clone."
    exit 1
}

# Ask the user for the GitHub fine-grained token
$GITHUB_TOKEN = Read-Host -AsSecureString "[INPUT] - Please enter your GitHub Token:"
$GITHUB_TOKEN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($GITHUB_TOKEN))

# Validate the token (ensure it's not empty)
if (-Not $GITHUB_TOKEN) {
    Write-Host "[ERROR] - The token cannot be empty."
    exit 1
}

# Clone the repository using the token
git clone "https:\\$GITHUB_TOKEN@$($REPO_URL -replace 'https:\\', '')"

# Check if the clone succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] - Cloning the repository failed. Please check your token and make sure the repository has not already been cloned."
    exit 1
}
