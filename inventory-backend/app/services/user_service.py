from app.config.db_config import user_collection
from app.dto.user_dto import UserDTO
from bson import ObjectId

class UserService:
    @staticmethod
    async def get_fullName(user_id: str):
        user = await user_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return user.get("fullName")
        return None