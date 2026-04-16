@echo off
REM Initialize database with virtual environment
cd /d "%~dp0"
call .venv\Scripts\activate.bat
python backend/init_db.py
pause