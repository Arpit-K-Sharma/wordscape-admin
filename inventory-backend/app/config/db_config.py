import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://spandanbhattarai79:spandan123@spandan.ey3fvll.mongodb.net/?retryWrites=true&w=majority&appName=spandan')

database = client.Wordscape
database_erp = client.ERP
orders_collection = database_erp.order
user_collection = database_erp.user

