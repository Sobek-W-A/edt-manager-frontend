# Variables
$FOLDER_NAME = "edt-manager-backend"
$BACKEND_REPOSITORY = "https://github.com/Sobek-W-A/edt-manager-backend.git"
$ENVIRONNMENT = $args[0]
$DEV = "development"
$PROD = "production"

function Clone-Repo-And-Build {
    # Cloning the frontend repository.
    .\scripts\cloner.ps1 $BACKEND_REPOSITORY $args[0]

    # Checking if the repository has been cloned successfully.
    if (-not $?) {
        Write-Host "[ERROR] - The repository has not been successfully cloned!" -ForegroundColor Red

        if (-not (Test-Path -Path $FOLDER_NAME)) {
            Write-Host "[ERROR] - The repository folder does not exist!" -ForegroundColor Red
            exit 1
        } else {
            Write-Host "[STATUS] - Repository's folder has been found. Proceeding..."
        }
    }

    # Moving to the cloned repository and executing the build script.
    Set-Location $FOLDER_NAME
    .\build.ps1 "bundle"
    Set-Location ..
}

function Run-Dev {
    # Cloning the repository in dev mode.
    Clone-Repo-And-Build "dev"

    # Launching the current application.
    Set-Location .\app

    npm install
    npm run dev
}

function Run-Prod {
    # Cloning the repository.
    Clone-Repo-And-Build

    # Running the compose file
    docker-compose -f .\docker-compose.yml up -d
}

# Cleaning eventual remainder files
.\scripts\clean.ps1

if ($ENVIRONNMENT) {
    if ($ENVIRONNMENT -eq $DEV) {
        Run-Dev
    } elseif ($ENVIRONNMENT -eq $PROD) {
        Run-Prod
    }
} else {
    Run-Dev
}
