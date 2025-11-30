from bson import ObjectId
from datetime import datetime

def oid_to_str(val):
    return str(val) if isinstance(val, ObjectId) else val

def sanitize_doc(doc: dict):
    """
    Convert a MongoDB document to a JSON-serializable dict:
    - ObjectId -> str
    - datetime -> ISO string
    - Handles nested dicts and lists.
    """
    if doc is None:
        return None

    def _sanitize(v):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, datetime):
            return v.isoformat()
        if isinstance(v, dict):
            return {k: _sanitize(v2) for k, v2 in v.items()}
        if isinstance(v, list):
            return [_sanitize(i) for i in v]
        return v

    return {k: _sanitize(v) for k, v in doc.items()}
