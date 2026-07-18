from fastapi import APIRouter

from dto import ModelInfo, ModelsResponse

# Group all model endpoints under /api/v1/models; tags group them in Swagger UI.
router = APIRouter(prefix="/api/v1/models", tags=["models"])


# GET /api/v1/models — response_model tells FastAPI/OpenAPI what JSON shape to document.
@router.get("", response_model=ModelsResponse)
def list_models():
    return ModelsResponse(
        models=[
            ModelInfo(id="demo-model", huggingface_id="demo/model"),
        ]
    )