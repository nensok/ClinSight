from typing import Literal, Optional
from fastapi import APIRouter, HTTPException, Query
from ..config import get_los_metrics

router = APIRouter()


@router.get("/los-metrics")
def los_metrics(
    group_by: Literal["encounter_class", "reason", "overall"] = Query("overall"),
    encounter_class: Optional[str] = Query(None),
):
    try:
        data = get_los_metrics()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    breakdown = []
    if group_by == "encounter_class":
        breakdown = data.get("by_encounter_class", [])
        if encounter_class:
            breakdown = [b for b in breakdown if b["label"].lower() == encounter_class.lower()]
    elif group_by == "reason":
        breakdown = data.get("by_reason", [])

    return {
        "group_by": group_by,
        "overall_hours": data.get("overall_hours", {}),
        "inpatient_days": data.get("inpatient_days", {}),
        "breakdown": breakdown,
        "distribution": data.get("distribution", []),
    }
