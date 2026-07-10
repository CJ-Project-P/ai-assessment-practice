from fastapi import APIRouter, Depends, Query

from app.auth import get_current_user_id
from app.games import GameId
from app.practice_records import service
from app.practice_records.schemas import PracticeRecordCreate, PracticeRecordOut

# Spring으로 치면 이 파일이 @RestController. 실제 로직은 service에 위임하고
# 여긴 요청/응답과 인증(Depends(get_current_user_id))만 다룬다.
router = APIRouter(prefix="/practice-records", tags=["practice-records"])


@router.post("", response_model=PracticeRecordOut)
def create_practice_record(body: PracticeRecordCreate, user_id: str = Depends(get_current_user_id)):
    return service.create_practice_record(user_id, body)


@router.get("", response_model=list[PracticeRecordOut])
def list_practice_records(game_id: GameId | None = Query(None), user_id: str = Depends(get_current_user_id)):
    return service.list_practice_records(user_id, game_id)


@router.delete("/{record_id}")
def delete_practice_record(record_id: str, user_id: str = Depends(get_current_user_id)):
    service.delete_practice_record(user_id, record_id)
    return {"ok": True}


@router.delete("")
def clear_practice_records(game_id: GameId | None = Query(None), user_id: str = Depends(get_current_user_id)):
    service.clear_practice_records(user_id, game_id)
    return {"ok": True}
