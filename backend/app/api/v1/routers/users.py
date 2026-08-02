from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.common import ApiResponse
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=ApiResponse[UserOut], response_model_by_alias=True)
def read_me(user: UserOut = Depends(get_current_user)) -> ApiResponse[UserOut]:
    return ApiResponse(data=user)
