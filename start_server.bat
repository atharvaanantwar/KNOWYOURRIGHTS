@echo off
REM Run FastAPI server with proper error handling
cd /d "%~dp0"

echo Activating virtual environment...
call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ Failed to activate virtual environment
    pause
    exit /b 1
)

echo Testing database connection...
python test_db.py
if %errorlevel% neq 0 (
    echo ❌ Database connection failed. Please run setup_postgres.bat first.
    pause
    exit /b 1
)

echo ✅ Starting FastAPI server...
python backend/main.py
pause