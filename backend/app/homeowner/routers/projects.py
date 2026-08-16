import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.dependencies.auth import require_homeowner
from app.shared.dependencies.db import get_db
from app.shared.schemas.common import ApiResponse
from app.homeowner.schemas.project import ProjectOut
from app.homeowner.schemas.quote import QuoteOut
from app.shared.schemas.user import UserOut
from app.homeowner.services import project_service, quote_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=ApiResponse[list[ProjectOut]], response_model_by_alias=True)
async def list_projects(
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[ProjectOut]]:
    projects = await project_service.list_projects(db, uuid.UUID(user.id))
    return ApiResponse(data=projects)


@router.get(
    "/{project_id}", response_model=ApiResponse[ProjectOut], response_model_by_alias=True
)
async def get_project(
    project_id: str,
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ProjectOut]:
    project = await project_service.get_project(db, uuid.UUID(user.id), project_id)
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
async def project_quotes(
    project_id: str,
    user: UserOut = Depends(require_homeowner),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[list[QuoteOut]]:
    quotes = await quote_service.list_for_project(db, uuid.UUID(user.id), project_id)
    return ApiResponse(data=quotes)
