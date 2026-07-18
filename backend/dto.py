from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field

StrategyName = Literal["template", "reactive", "gemini"]

class ModelInfo(BaseModel):
    id: str
    huggingface_id: str

class ModelResponse(BaseModel):
    models: List[ModelInfo]

class SubmitAttackRequest(BaseModel):
    objective: str = Field(..., min_length=1, description="The evaluation objective")
    models: List[str] = Field(..., min_length=1, description="Target model short names")
    strategy: StrategyName = Field(default="template")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_turns: int = Field(default=10, ge=2, le=20)
    seed: Optional[int] = None

class SubmitAttackResponse(BaseModel):
    job_id: str
    status: str
    objective: str
    strategy: str
    models: List[str]
    max_turns: int

class TurnDTO(BaseModel):
    index: int
    prompt: str
    response: Optional[str]
    verdict: str
    reasons: List[str]
    latency_ms: float
    error: Optional[str]

class ModelRunDTO(BaseModel):
    model: str
    status: str
    current_step: int
    turns: List[TurnDTO]
    final_output: Optional[str]
    final_verdict: Optional[str]

class AttackJobDTO(BaseModel):
    job_id: str
    objective: str
    strategy: str
    status: str
    max_turns: int
    models: Dict[str, ModelRunDTO]
    error: Optional[str] = None
    total_duration_ms: Optional[float] = None

