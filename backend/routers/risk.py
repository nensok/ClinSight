from typing import Literal, Optional
from fastapi import APIRouter, HTTPException, Query
from ..config import get_risk_patients

router = APIRouter()


@router.get("/risk-patients")
def risk_patients(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    min_risk: float = Query(0.0, ge=0.0, le=1.0),
    encounter_class: Optional[str] = Query(None),
    age_group: Optional[str] = Query(None),
    sort_by: Literal["risk_score", "total_encounters", "avg_cost"] = Query("risk_score"),
    order: Literal["asc", "desc"] = Query("desc"),
):
    try:
        all_patients = get_risk_patients()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    # Filter
    filtered = [p for p in all_patients if p.get("risk_score", 0) >= min_risk]
    if encounter_class:
        filtered = [p for p in filtered if p.get("encounter_class", "").lower() == encounter_class.lower()]
    if age_group:
        filtered = [p for p in filtered if p.get("age_group", "").lower() == age_group.lower()]

    # Sort
    reverse = order == "desc"
    filtered = sorted(filtered, key=lambda p: p.get(sort_by, 0) or 0, reverse=reverse)

    total = len(filtered)
    page = filtered[offset: offset + limit]

    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "patients": page,
    }
