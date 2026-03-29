from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import admissions, los, cost, insurance, kpi, risk

app = FastAPI(
    title="ClinSight Analytics API",
    description="Aggregated analytics endpoints for the ClinSight Patient Analytics dashboard.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(kpi.router,        prefix="/api", tags=["KPI"])
app.include_router(admissions.router, prefix="/api", tags=["Admissions"])
app.include_router(los.router,        prefix="/api", tags=["Length of Stay"])
app.include_router(cost.router,       prefix="/api", tags=["Cost"])
app.include_router(insurance.router,  prefix="/api", tags=["Insurance"])
app.include_router(risk.router,       prefix="/api", tags=["Risk"])


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "docs": "/docs"}
