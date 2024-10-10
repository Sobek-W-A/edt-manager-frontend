function run_dev {
    # Launching the current application
    Set-Location .\app
    npm install
    npm run dev
}

function run_prod {
    # Running the compose file
    docker-compose -f .\docker-compose.yml up -d
}

# Variables
$FOLDER_NAME = "edt-manager-backend"
$BACKEND_REPOSITORY = "https://github.com/Sobek-W-A/edt-manager-backend.git"
$ENVIRONNMENT = $args[0]
$DEV = "development"
$PROD = "production"

# Cleaning eventual remainder files
.\scripts\clean.ps1

# Cloning the backend repository
.\scripts\cloner.ps1 $BACKEND_REPOSITORY

# Checking if the repository has been cloned successfully
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] - The repository has not been successfully cloned!"

    if (-Not (Test-Path $FOLDER_NAME)) {
        Write-Host "[ERROR] - The repository folder does not exist!"
        exit 1
    } else {
        Write-Host "[STATUS] - Repository's folder has been found. Proceeding..."
    }
}

# Moving to the cloned repository and executing the build script
Set-Location $FOLDER_NAME
.\build.ps1 "bundle"
Set-Location ..

if ($ENVIRONNMENT) {
    if ($ENVIRONNMENT -eq $DEV) {
        run_dev
    } elseif ($ENVIRONNMENT -eq $PROD) {
        run_prod
    }
} else {
    run_dev
}
