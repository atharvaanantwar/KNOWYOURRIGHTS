@echo off
REM PostgreSQL Setup Script for Windows
echo Setting up PostgreSQL database and user...
echo.

REM Set PostgreSQL bin path (adjust if different)
set PG_BIN="C:\Program Files\PostgreSQL\18\bin"

REM Create database and user
echo Creating database and user...
%PG_BIN%\psql -U postgres -h localhost -c "CREATE DATABASE IF NOT EXISTS legal_quiz;" 2>nul
if %errorlevel% neq 0 (
    echo Please enter your PostgreSQL password when prompted:
    %PG_BIN%\psql -U postgres -h localhost -c "CREATE DATABASE legal_quiz;"
)

%PG_BIN%\psql -U postgres -h localhost -c "CREATE USER IF NOT EXISTS postgres WITH PASSWORD 'password';" 2>nul
if %errorlevel% neq 0 (
    echo Setting password for postgres user...
    %PG_BIN%\psql -U postgres -h localhost -c "ALTER USER postgres PASSWORD 'password';"
)

%PG_BIN%\psql -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE legal_quiz TO postgres;" 2>nul

echo.
echo PostgreSQL setup complete!
echo Database: legal_quiz
echo User: postgres
echo Password: password
echo.
pause