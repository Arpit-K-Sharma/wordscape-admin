from pydantic import BaseModel, Field
from bson.dbref import DBRef
import json

class UserDTO(BaseModel): 
    fullName: str
    password: str
    email: str
    status: bool
    role: str
    
    def from_user_collection(document: dict) -> 'UserDTO':
        return UserDTO (
            fullName=document.get("fullName"),
            password=document.get("password"),
            email=document.get("email"),
            status=document.get("status"),
            role=document.get("role")
        )