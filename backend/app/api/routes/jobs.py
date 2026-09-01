# FILE LOCATION: app/api/routes/jobs.py
"""
PURPOSE
-------
Migrated from backend_2's Flask blueprint (app/routes/jobs.py). Lets the
frontend fetch which target-job roles have a supported skill checklist
(defined in app/data/job_requirements.py), e.g. to populate the
target_job dropdown/autocomplete on the analyze form, so users pick a
role that actually has a checklist behind it.

HOW IT FITS INTO THE PROGRAM
-----------------------------
- Reads from app.services.target_job_matcher.get_supported_target_jobs(),
  which just returns the sorted keys of JOB_REQUIREMENTS.
- Mounted in app/main.py via:
      app.include_router(jobs_router, prefix="/api")
  so this endpoint is reachable at GET /api/jobs/supported.
"""

from fastapi import APIRouter
from app.services.target_job_matcher import get_supported_target_jobs

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/supported", summary="List supported target-job roles")
def supported_jobs():
    return {"jobs": get_supported_target_jobs()}