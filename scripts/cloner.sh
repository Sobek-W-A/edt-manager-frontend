#!/bin/bash

# Variables
REPO_URL="$1"
FOLDER_NAME="edt-manager-backend"

if [[ -z "$REPO_URL" ]]; then
    echo "[ERROR] - No repository was indicated. Impossible to clone."
    exit 1
fi

# Ask the user for the GitHub fine-grained token
read -sp "[INPUT] - Please enter your GitHub Token: " GITHUB_TOKEN
echo

# Validate the token (ensure it's not empty)
if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "[ERROR] - The token cannot be empty."
    exit 1
fi

# Clone the repository using the token
git clone https://"$GITHUB_TOKEN"@${REPO_URL#https://}

# Check if the clone succeeded
if [ ! $? ]; then
    echo "[ERROR] - Cloning the repository failed. Please check your token and make sure the repository has not already been cloned."
    exit 1
fi
