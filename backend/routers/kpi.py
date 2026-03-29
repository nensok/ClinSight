from fastapi import APIRouter, HTTPException
from ..config import get_kpi_summary

router = APIRouter()


@router.get("/kpi-summary")
def kpi_summary():
    try:
        return get_kpi_summary()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
