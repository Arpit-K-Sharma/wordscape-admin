from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

from app.controller.approved_orders_controller import approved_orders_route
from app.controller.user_controller import user_route

app=FastAPI()

#CORS Configuration
origins = [
    "*"
] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(approved_orders_route, tags=["approved_orders"])
app.include_router(user_route, tags=["user"])

# Root route 
@app.get("/ims")
async def root():
    return {"message": "Welcome to the Inventory ERP system"}