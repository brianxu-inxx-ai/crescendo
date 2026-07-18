from fastapi import APIRouter, status

from dto import AttackJobDTO, ModelRunDTO, SubmitAttackRequest, SubmitAttackResponse

router = APIRouter(prefix="/api/v1/attacks", tags=["attacks"])
@router.post("", response_model=SubmitAttackResponse, status_code=status.HTTP_202_ACCEPTED)
def submit_attack(payload: SubmitAttackRequest):
    return SubmitAttackResponse(
        job_id="demo-job-001",
        status="queued",
        objective=payload.objective,
        strategy=payload.strategy,
        models=payload.models,
        max_turns=payload.max_turns,
    )

def _mock_job(job_id: str) -> AttackJobDTO:
    return AttackJobDTO(
        job_id=job_id,
        objective="mock objective",
        strategy="template",
        status="queued",
        max_turns=10,
        models={
            "demo-model": ModelRunDTO(
                model="demo-model",
                status="queued",
                current_step=0,
                turns=[],
                final_output=None,
                final_verdict=None,
            )
        },
    )

@router.get("/{job_id}", response_model=AttackJobDTO)
def get_attack(job_id: str):
    return _mock_job(job_id)

@router.get("/{job_id}/trace", response_model=AttackJobDTO)
def get_attack_trace(job_id: str):
    return _mock_job(job_id)
