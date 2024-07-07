from app.config.db_config import orders_collection
from app.dto.approved_orders_dto import ApprovedOrdersDTO

class ApprovedOrdersService:
    @staticmethod
    async def fetch_all_approved_orders():
        approved_orders = []
        cursor = orders_collection.find({"status": "APPROVED"})
        async for order in cursor:
            order["_id"] = str(order["_id"])  # Convert ObjectId to str for JSON serialization
            approved_orders.append(order)

        return [ApprovedOrdersDTO.from_order_collection(order) for order in approved_orders]
