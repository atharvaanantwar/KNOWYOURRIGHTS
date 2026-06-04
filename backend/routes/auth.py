from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from uuid import uuid4

from db import get_db
from models.models import User
from security import create_access_token, verify_password
from security import hash_password

router = APIRouter(prefix="/auth", tags=["Auth"])


# =========================
# SIGNUP
# =========================
@router.post("/signup")
def signup(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")

    # 🔥 Ensure required fields
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    # ✅ Handle username properly
    username = data.get("username")

    if not username:
        # auto-generate from email
        username = email.split("@")[0]

    # 🔥 Prevent duplicate email
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    # 🔥 Prevent duplicate username
    if db.query(User).filter(User.username == username).first():
        username = f"{username}_{str(uuid4())[:4]}"

    # ✅ Create user
    user = User(
        id=uuid4(),
        email=email,
        hashed_password=hash_password(password),
        username=username
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User created successfully",
        "user_id": str(user.id),
        "username": user.username
    }


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data["email"]).first()

    if not user or not verify_password(data["password"], user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "username": user.username
    }