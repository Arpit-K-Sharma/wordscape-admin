from fastapi import APIRouter, HTTPException
from app.services.user_service import UserService

user_route = APIRouter()

@user_route.get('/get/user/{id}')
async def get_user(id: str):
    response = await UserService.get_fullName(id)
    return {"message": "User Fetched Successfully", "data": {"fullName": response}}