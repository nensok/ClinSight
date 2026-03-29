"""
Centralized data loader for pre-computed JSON files.
Uses lru_cache so each file is read from disk only once per process lifetime.
"""
import json
from functools import lru_cache
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data" / "processed"


def _load(filename: str):
    path = DATA_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}. Run the Jupyter notebook first.")
    return json.loads(path.read_text(encoding="utf-8"))


@lru_cache(maxsize=None)
def get_admissions_trend():
    return _load("admissions_trend.json")


@lru_cache(maxsize=None)
def get_los_metrics():
    return _load("los_metrics.json")


@lru_cache(maxsize=None)
def get_cost_analysis():
    return _load("cost_analysis.json")


@lru_cache(maxsize=None)
def get_insurance_coverage():
    return _load("insurance_coverage.json")


@lru_cache(maxsize=None)
def get_kpi_summary():
    return _load("kpi_summary.json")


@lru_cache(maxsize=None)
def get_risk_patients():
    return _load("risk_patients.json")
