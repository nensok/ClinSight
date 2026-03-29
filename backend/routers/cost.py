from typing import Literal, Optional
from fastapi import APIRouter, HTTPException, Query
from ..config import get_cost_analysis

router = APIRouter()


@router.get("/cost-analysis")
def cost_analysis(
    group_by: Literal["encounter_class", "payer", "procedure"] = Query("encounter_class"),
    encounter_class: Optional[str] = Query(None),
    payer: Optional[str] = Query(None),
    top_n: int = Query(10, ge=1, le=50),
):
    try:
        data = get_cost_analysis()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    breakdown = []
    if group_by == "encounter_class":
        breakdown = data.get("by_encounter_class", [])
        if encounter_class:
            breakdown = [b for b in breakdown if b["label"].lower() == encounter_class.lower()]
    elif group_by == "payer":
        breakdown = data.get("by_payer", [])
        if payer:
            breakdown = [b for b in breakdown if b["label"].lower() == payer.lower()]
    elif group_by == "procedure":
        breakdown = data.get("top_procedures", [])[:top_n]

    return {
        "group_by": group_by,
        "summary": data.get("overall", {}),
        "breakdown": breakdown,
        "top_procedures": data.get("top_procedures", [])[:top_n],
        "distribution_buckets": data.get("distribution_buckets", []),
    }
