# PowerShell script to activate virtual environment
Set-Location $PSScriptRoot
& ".\.venv\Scripts\activate.ps1"
Write-Host "Virtual environment activated!" -ForegroundColor Green
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Yellow
Write-Host "  python backend/main.py     - Start FastAPI server" -ForegroundColor Cyan
Write-Host "  python backend/init_db.py  - Initialize database" -ForegroundColor Cyan
Write-Host "  deactivate                 - Exit virtual environment" -ForegroundColor Cyan
Write-Host ""