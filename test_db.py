#!/usr/bin/env python3

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/legal_quiz")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        version = result.fetchone()
        print(f"✅ Connected to PostgreSQL: {version[0]}")

        # Check if database exists
        result = conn.execute(text("SELECT datname FROM pg_database WHERE datname = 'legal_quiz'"))
        if result.fetchone():
            print("✅ Database 'legal_quiz' exists")
        else:
            print("❌ Database 'legal_quiz' does not exist")

        # Check if tables exist
        result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = result.fetchall()
        if tables:
            print(f"✅ Found tables: {[t[0] for t in tables]}")
        else:
            print("ℹ️  No tables found (run init_db.py to create them)")

except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print("Make sure PostgreSQL is running and the database credentials are correct.")