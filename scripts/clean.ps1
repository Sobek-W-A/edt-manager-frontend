Write-Host "[STATUS] - Cleaning environment-related files..."

Remove-Item -Recurse -Force .\edt-manager-backend

Write-Host "[STATUS] - Done cleaning!"
