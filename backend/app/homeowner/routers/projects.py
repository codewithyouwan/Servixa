import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import require_homeowner
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.project import ProjectCreate, ProjectOut
from app.homeowner.schemas.quote import QuoteOut
from app.shared.schemas.user import UserOut
from app.homeowner.services import mock_data
from app.homeowner.services.project_service import (
    create_project_for_user,
    get_project_for_user,
    list_projects_for_user,
)
from db.database import get_db

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=ApiResponse[list[ProjectOut]], response_model_by_alias=True)
async def list_projects(
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[ProjectOut]]:
    return ApiResponse(data=await list_projects_for_user(db, user))


@router.post(
    "",
    response_model=ApiResponse[ProjectOut],
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    payload: ProjectCreate,
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ProjectOut]:
    return ApiResponse(data=await create_project_for_user(db, user, payload))


@router.get(
    "/{project_id}", response_model=ApiResponse[ProjectOut], response_model_by_alias=True
)
async def get_project(
    project_id: str,
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ProjectOut]:
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "NOT_FOUND", "message": "Project not found"}},
        )
    project = await get_project_for_user(db, user, pid)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "NOT_FOUND", "message": "Project not found"}},
        )
    return ApiResponse(data=project)


@router.get(
    "/{project_id}/quotes",
    response_model=ApiResponse[list[QuoteOut]],
    response_model_by_alias=True,
)
def project_quotes(
    project_id: str, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[list[QuoteOut]]:
    # Quotes are still mock — the matching/quoting pipeline hasn't moved
    # off mock data yet. A real (DB-backed) project_id simply won't match
    # any mock quote here, so this returns [] until that piece is built.
    return ApiResponse(
        data=[q for q in mock_data.MOCK_QUOTES if q.project_id == project_id]
    )
