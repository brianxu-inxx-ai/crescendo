from fastapi import APIRouter

from dto import ModelInfo, ModelsResponse

# Group all model endpoints under /api/v1/models; tags group them in Swagger UI.
router = APIRouter(prefix="/api/v1/models", tags=["models"])


@router.get("", response_model=ModelsResponse)
async def get_models():
    return ModelsResponse(
        models=[
            ModelInfo(id="demo-model", huggingface_id="demo/model"),
        ]
    )