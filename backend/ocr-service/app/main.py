# app/main.py

import os
from fastapi import FastAPI
from app.routes import ocr_router
from py_eureka_client import eureka_client
from contextlib import asynccontextmanager
import logging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app_: FastAPI):
    host_ip = os.environ["HOST_IP"]
    eureka_url = os.environ["EUREKA_URL"]
    await eureka_client.init_async(
        eureka_server=eureka_url,
        app_name="ocr-service",
        instance_port=8083,
        instance_host=host_ip,
        instance_ip=host_ip
    )
    logger.info("Eureka client initialized")
    yield
    logger.info("Stopping Eureka client")
    await eureka_client.stop_async()

app = FastAPI(lifespan=lifespan)
app.include_router(ocr_router.router, prefix="") 

origins = [
    "https://k12d206.p.ssafy.io",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600,
)

if __name__ == "__main__":
    import uvicorn
