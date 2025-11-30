from fastapi import Depends, HTTPException, status,Header
from jose import jwt, JWTError
from app.database import db
from app.utils.auth import SECRET_KEY, ALGORITHM
from bson import ObjectId

async def get_token_header(authorization: str = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization format. Use: Bearer <token>")

    return parts[1]


async def get_current_user(token: str = Depends(get_token_header)):
    # decode token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    # fetch user
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=401, detail="Invalid user")

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # convert ObjectId to string
    user["id"] = str(user["_id"])
    return user
