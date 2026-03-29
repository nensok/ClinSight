from typing import Literal
from fastapi import APIRouter, HTTPException, Query
from ..config import get_insurance_coverage

router = APIRouter()


@router.get("/insurance-coverage")
def insurance_coverage(
    group_by: Literal["payer", "encounter_class"] = Query("payer"),
):
    try:
        data = get_insurance_coverage()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    breakdown_key = "by_payer" if group_by == "payer" else "by_encounter_class"

    return {
        "group_by": group_by,
        "overall": data.get("overall", {}),
        "breakdown": data.get(breakdown_key, []),
    }
