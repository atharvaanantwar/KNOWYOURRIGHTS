# Legal Quiz App - Backend Setup

## Prerequisites
- Python 3.8+
- PostgreSQL
- Node.js (for frontend)

## Setup Instructions

### 1. Set up Python Virtual Environment
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows PowerShell)
.venv\Scripts\activate

# Or use the convenience script
activate.bat
```

### Convenience Scripts (Windows)
- `activate.bat` - Activate virtual environment and show commands
- `activate.ps1` - PowerShell version of activation script
- `setup_postgres.bat` - Set up PostgreSQL database and user
- `test_db.bat` - Test database connection
- `init_db.bat` - Initialize database tables and data
- `start_server.bat` - Start FastAPI server (with checks)
- `run_server.bat` - Start FastAPI server (basic)

## Troubleshooting

### Database Connection Issues
If you get authentication errors:

1. **Run PostgreSQL setup:**
   ```bash
   setup_postgres.bat
   ```

2. **Or manually set up PostgreSQL:**
   ```sql
   -- Connect as superuser (usually 'postgres')
   CREATE DATABASE legal_quiz;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE legal_quiz TO postgres;
   ```

3. **Test connection:**
   ```bash
   test_db.bat
   ```

### Virtual Environment Issues
- Always use `activate.bat` to activate the virtual environment
- Use `".\.venv\Scripts\python.exe"` for running Python scripts
- Avoid running `python` directly (uses system Python, not venv)

### Common Errors
- **"Module not found"**: Activate virtual environment first
- **"Connection failed"**: Check PostgreSQL is running and credentials are correct
- **"Database does not exist"**: Run `init_db.bat` first

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set up PostgreSQL Database
```sql
CREATE DATABASE legal_quiz;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE legal_quiz TO postgres;
```

### 4. Configure Environment
Update `backend/.env` with your database credentials:
```
DATABASE_URL=postgresql://postgres:password@localhost/legal_quiz
```

### 5. Initialize Database
```bash
# Using batch script (Windows)
init_db.bat

# Or manually
.venv\Scripts\activate
python backend/init_db.py
```

### 6. Start Backend Server
```bash
# Recommended: Use the smart startup script (Windows)
start_server.bat

# Or manually
.venv\Scripts\activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Start Frontend (in separate terminal)
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /questions?domain=&difficulty=` - Get filtered questions
- `GET /api/user/stats` - Get user statistics
- `PUT /api/user/stats` - Update user statistics
- `POST /api/user/completed-scenarios` - Add completed scenario
- `GET /api/user/completed-scenarios` - Get completed scenarios
- `POST /api/user/xp-history` - Add XP entry
- `GET /api/user/xp-history` - Get XP history
- `GET /api/user/progress` - Get full user progress

## Database Schema

- `questions` - Question bank
- `users` - User profiles
- `completed_scenarios` - User's completed questions
- `xp_history` - XP transaction history