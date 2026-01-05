from fastapi import APIRouter, HTTPException
from app.database import db
from app.models.user import UserCreate, UserLogin
from app.utils.auth import hash_password, verify_password, create_access_token
from app.utils.serializers import sanitize_doc
from datetime import datetime
from fastapi import Depends
from app.utils.deps import get_current_user

router = APIRouter(prefix="/auth")

@router.post("/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password_hash": hash_password(user.password),
        "phone": user.phone,
        "role": user.role,
        "rating": 0,
        "created_at": datetime.utcnow()
    }

    result = await db.users.insert_one(new_user)
    # fetch the created document (optional) and sanitize
    created = await db.users.find_one({"_id": result.inserted_id})
    created = sanitize_doc(created)

    # remove sensitive fields before returning
    created.pop("password_hash", None)

    # optionally rename _id -> id
    if "_id" in created:
        created["id"] = created.pop("_id")

    return created


@router.post("/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({ "user_id": str(user["_id"]) })

    # sanitize and return safe user info along with token
    from app.utils.serializers import sanitize_doc
    safe_user = sanitize_doc(user)
    safe_user.pop("password_hash", None)
    if "_id" in safe_user:
        safe_user["id"] = safe_user.pop("_id")

    return { "access_token": token, "user": safe_user }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user