from typing import Literal, Optional
from fastapi import APIRouter, HTTPException, Query
from ..config import get_admissions_trend

router = APIRouter()


@router.get("/admissions-trend")
def admissions_trend(
    granularity: Literal["daily", "weekly", "monthly"] = Query("monthly"),
    start_date: Optional[str] = Query(None, description="YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="YYYY-MM-DD"),
    encounter_class: Optional[str] = Query(None),
):
    try:
        data = get_admissions_trend()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    records = data[granularity]

    # Date filtering
    if start_date or end_date:
        period_key = {"daily": "date", "weekly": "week", "monthly": "month"}[granularity]
        if start_date:
            records = [r for r in records if str(r[period_key]) >= start_date]
        if end_date:
            records = [r for r in records if str(r[period_key]) <= end_date]

    return {
        "granularity": granularity,
        "data": records,
        "meta": data.get("meta", {}),
    }
