@echo off
REM Test database connection
cd /d "%~dp0"
call .venv\Scripts\activate.bat
python test_db.py
pause