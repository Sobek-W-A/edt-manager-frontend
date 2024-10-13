# Variables
$REPO_URL = $args[0]
$BRANCH_NAME = $args[1]
$FOLDER_NAME = "edt-manager-backend"

if (-Not $REPO_URL) {
    Write-Host "[ERROR] - No repository was indicated. Impossible to clone."
    exit 1
}

# Ask the user for the GitHub fine-grained token
$GITHUB_TOKEN = Read-Host -Prompt "[INPUT] - Please enter your GitHub Token "

# Validate the token (ensure it's not empty)
if (-Not $GITHUB_TOKEN) {
    Write-Host "[ERROR] - The token cannot be empty."
    exit 1
}

# Ensure that the URL is formatted correctly to pass the token in the clone URL
# Add a trailing ".git" if it is not included in the URL
if (-Not $REPO_URL.EndsWith(".git")) {
    $REPO_URL += ".git"
}

# Build the URL with the token embedded
$REPO_URL_WITH_TOKEN = $REPO_URL -replace "^https://", "https://$GITHUB_TOKEN@"

# Clone the repository using the token
git clone $REPO_URL_WITH_TOKEN $FOLDER_NAME

# Check if the clone succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] - Cloning the repository failed. Please check your token and make sure the repository URL is correct."
    exit 1
}

# Change to the repository directory
Set-Location $FOLDER_NAME

# Check if the branch argument is set to "dev"
if ($BRANCH_NAME -eq "dev") {
    Write-Host "[INFO] - Checking out the 'dev' branch."
    git checkout dev

    # Check if the checkout succeeded
    if (-not $?) {
        Write-Host "[ERROR] - Failed to checkout the 'dev' branch." -ForegroundColor Red
        exit 1
    }
}

Set-Location ..

Write-Host "[SUCCESS] - Repository cloned successfully!"
