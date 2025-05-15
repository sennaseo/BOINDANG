from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from app.services.main_service import process_images

router = APIRouter()

class ImageUrlRequest(BaseModel):
    ingredient_image_url: str
    nutrition_image_url: str

@router.post("/ocr/upload")
async def upload_images_by_url(payload: ImageUrlRequest):
    print("요청 감지 (URL)")
    print("Ingredient Image URL:", payload.ingredient_image_url)
    print("Nutrition Image URL:", payload.nutrition_image_url)

    img_urls = dict()
    img_urls['ingredient_image_url'] = payload.ingredient_image_url
    img_urls['nutrition_image_url'] = payload.nutrition_image_url

    try:
        result = await process_images(
            img_urls,
            str(payload.ingredient_image_url),
            str(payload.nutrition_image_url)
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
