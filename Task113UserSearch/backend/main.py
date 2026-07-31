from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dto import SearchResult
import sqlite3

app = FastAPI(
    title="UserSearch", version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/") # Endpoint to check if the API is running
def read_root():
    return "Hello World!"

@app.get("/health") # Endpoint to check the health of the API
def health_check():
    return {"status": "ok"}

# I'm not sure this is how we should do it, but...
router = APIRouter(prefix="/api/v1/search", tags=["search"])
@router.get("/", response_model=SearchResult)
async def get_search_result(query: str):
    connection = sqlite3.connect("users.db")
    cursor = connection.cursor()
    if type(query) is not str or query == "":
        cursor.execute("SELECT name FROM users")
    else:
        cursor.execute("SELECT name FROM users WHERE name LIKE ?", (f"%{query}%",))
    results = [row[0] for row in cursor.fetchall()]
    connection.close()
    
    return SearchResult(
        message = "Search endpoint is working!",
        items = results
    )

# Register the router so its endpoints appear in docs
app.include_router(router)