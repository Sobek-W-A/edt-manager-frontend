#!/bin/bash

function run_dev() {
  # Launching the current application.
  cd ./app || exit 1

  npm install
  npm run dev
}

function run_prod() {
  # Running the compose file
  docker compose -f ./docker-compose.yml up -d
}

# Variables
FOLDER_NAME="edt-manager-backend"
BACKEND_REPOSITORY="https://github.com/Sobek-W-A/edt-manager-backend.git"
ENVIRONNMENT="$1"
DEV="development"
PROD="production"

# Cloning the frontend repository.
chmod +x ./scripts/cloner.sh
./scripts/cloner.sh "$BACKEND_REPOSITORY"

# Checking if the repository has been cloned successfully.
if [ ! $? ]; then
  echo "[ERROR] - The repository has not been successfully cloned !"

  if [ ! -d "$FOLDER_NAME" ]; then
    echo "[ERROR] - The repository folder does not exist !"
    exit 1
  else
    echo "[STATUS] - Repository's folder has been found. Proceeding..."
  fi
fi

# Moving to the cloned repository and executing the build script.
cd "$FOLDER_NAME" || exit 1
chmod +x "./$FOLDER_NAME/build.sh"
./build.sh "bundle"
cd ..

if [[ -n "$ENVIRONNMENT" ]]; then
  if [[ "$ENVIRONNMENT" == "$DEV" ]]; then
    run_dev
  elif [[ "$ENVIRONNMENT" == "$PROD" ]]; then
    run_prod
  fi
else
  run_dev
fi
