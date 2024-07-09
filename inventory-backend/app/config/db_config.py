import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://siron:password%40123@cluster0.5h1sajb.mongodb.net/')

database = client.erp
orders_collection = database.order
user_collection = database.user

