from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import require_homeowner
from app.schemas.common import ApiResponse
from app.schemas.project import ProjectOut
from app.schemas.quote import QuoteOut
from app.schemas.user import UserOut
from app.services import mock_data

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=ApiResponse[list[ProjectOut]], response_model_by_alias=True)
def list_projects(
    user: UserOut = Depends(require_homeowner),
) -> ApiResponse[list[ProjectOut]]:
    return ApiResponse(data=mock_data.MOCK_PROJECTS)


@router.get(
    "/{project_id}", response_model=ApiResponse[ProjectOut], response_model_by_alias=True
)
def get_project(
    project_id: str, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[ProjectOut]:
    for project in mock_data.MOCK_PROJECTS:
        if project.id == project_id:
            return ApiResponse(data=project)
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"error": {"code": "NOT_FOUND", "message": "Project not found"}},
    )


@router.get(
    "/{project_id}/quotes",
    response_model=ApiResponse[list[QuoteOut]],
    response_model_by_alias=True,
)
def project_quotes(
    project_id: str, user: UserOut = Depends(require_homeowner)
) -> ApiResponse[list[QuoteOut]]:
    return ApiResponse(
        data=[q for q in mock_data.MOCK_QUOTES if q.project_id == project_id]
    )
