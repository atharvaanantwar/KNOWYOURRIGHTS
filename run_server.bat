@echo off
REM Run FastAPI server with virtual environment
cd /d "%~dp0"
call .venv\Scripts\activate.bat
python backend/main.py
pause