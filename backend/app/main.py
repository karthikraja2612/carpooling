from fastapi import FastAPI
from app.routes import auth, rides, requests, user
from fastapi.openapi.models import APIKey, APIKeyIn
from fastapi.openapi.utils import get_openapi


app = FastAPI()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Carpool API",
        version="1.0",
        description="Backend API for Carpooling Application",
        routes=app.routes,
    )

    # Add Bearer auth
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    # Apply Auth globally (optional)
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi


app.include_router(auth.router)
app.include_router(rides.router)
app.include_router(requests.router)
app.include_router(user.router)

@app.get("/")
def home():
    return {"message": "Carpool API running"}
