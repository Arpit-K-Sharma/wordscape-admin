from fastapi import APIRouter, HTTPException
from app.services.approved_orders_services import ApprovedOrdersService

approved_orders_route = APIRouter()

@approved_orders_route.get('/get/approved_orders')
async def get_approved_orders():
    response = await ApprovedOrdersService.fetch_all_approved_orders()
    return {"message": "Approved Orders Fetched Successfully", "data": response}