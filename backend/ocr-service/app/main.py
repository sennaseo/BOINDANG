# app/main.py
import os

from fastapi import FastAPI
from app.routes import ocr_router
from py_eureka_client import eureka_client
from contextlib import asynccontextmanager
import logging

app = FastAPI()
app.include_router(ocr_router.router, prefix="/ocr")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app_: FastAPI):
    host_ip = os.environ["HOST_IP"]
    eureka_url = os.environ["EUREKA_URL"]
    await eureka_client.init_async(
        eureka_server="http://" + eureka_url + ":8761/eureka",
        app_name="ocr-service",
        instance_port=8083,
        instance_host=host_ip,
        instance_ip=host_ip
    )
    logger.info("Eureka client initialized")
    yield
    # Shutdown
    logger.info("Stopping Eureka client")
    await eureka_client.stop_async()


app = FastAPI(lifespan=lifespan)

# @app("startup")
# async def startup_event():
#     print("Routes:", app.routes)

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True) # 개발 시 주석 해제
