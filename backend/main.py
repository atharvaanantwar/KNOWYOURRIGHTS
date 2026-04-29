from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import Base, engine
from routes import questions  # Person 2 routes
from routes import progress
from routes import auth
from routes import user



# =========================
# CREATE APP
# =========================
app = FastAPI(
    title="KnowYourRights API",
    description="Gamified civic education backend",
    version="1.0.0"
)


# =========================
# CORS (for frontend)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# CREATE TABLES (optional safety)
# =========================
Base.metadata.create_all(bind=engine)


# =========================
# ROUTES
# =========================
app.include_router(questions.router)
app.include_router(progress.router)
app.include_router(auth.router)
app.include_router(user.router)

# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {
        "message": "KnowYourRights API is running 🚀"
    }