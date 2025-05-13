from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    CLOVA_OCR_API_URL: str
    CLOVA_OCR_SECRET_KEY: str
    OPENAI_API_URL: str
    OPENAI_API_KEY: str
    MONGODB_URI: str
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_NAME: str
    EUREKA_URL: str
    HOST_IP:str


    # model_config = SettingsConfigDict(env_file="../../.env")  # ✅ 여기 수정!
    model_config = SettingsConfigDict(env_file=".env_ocr")



@lru_cache()
def get_settings():
    return Settings()

