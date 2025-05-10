# app/main.py

from fastapi import FastAPI
from app.routes import ocr_router

app = FastAPI()
app.include_router(ocr_router.router, prefix="/ocr")

# @app("startup")
# async def startup_event():
#     print("Routes:", app.routes)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

