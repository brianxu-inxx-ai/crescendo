from fastapi import FastAPI

app = FastAPI(
    title="Crescendo"
)

@app.get("/") # Endpoint to check if the API is running
def read_root():
    return "Hello World!"

@app.get("/health") # Endpoint to check the health of the API
def health_check():
    return {"status": "ok"}