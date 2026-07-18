from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.models import router as models_router
from routers.attacks import router as attacks_router

app = FastAPI(
    title="Crescendo", version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(models_router)
app.include_router(attacks_router)

@app.get("/") # Endpoint to check if the API is running
def read_root():
    return "Hello World!"

@app.get("/health") # Endpoint to check the health of the API
def health_check():
    return {"status": "ok"}