@echo off
REM Activate virtual environment and start development
cd /d "%~dp0"
call .venv\Scripts\activate.bat
echo Virtual environment activated!
echo.
echo Available commands:
echo - python backend/main.py    (start FastAPI server)
echo - python backend/init_db.py (initialize database)
echo - deactivate               (exit virtual environment)
echo.
cmd /k