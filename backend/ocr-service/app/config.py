from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    CLOVA_OCR_API_URL: str
    CLOVA_OCR_SECRET_KEY: str
    OPENAI_API_URL: str
    MONGODB_URI: str
    OPENAI_API_KEY: str

    # model_config = SettingsConfigDict(env_file="../../.env")  # ✅ 여기 수정!
    model_config = SettingsConfigDict(env_file=".env")



@lru_cache()
def get_settings():
    return Settings()

