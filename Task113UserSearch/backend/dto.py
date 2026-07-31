from pydantic import BaseModel
from typing import List

class SearchResult(BaseModel):
    message: str
    items: List[str]  # List of names returned from the search