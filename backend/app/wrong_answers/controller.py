from fastapi import APIRouter, Depends, Query

from app.auth import get_current_user_id
from app.wrong_answers import service
from app.wrong_answers.schemas import WrongAnswerCreate, WrongAnswerGameId, WrongAnswerOut

router = APIRouter(prefix="/wrong-answers", tags=["wrong-answers"])


@router.post("", response_model=WrongAnswerOut)
def create_wrong_answer(body: WrongAnswerCreate, user_id: str = Depends(get_current_user_id)):
    return service.create_wrong_answer(user_id, body)


@router.get("", response_model=list[WrongAnswerOut])
def list_wrong_answers(game_id: WrongAnswerGameId | None = Query(None), user_id: str = Depends(get_current_user_id)):
    return service.list_wrong_answers(user_id, game_id)


@router.delete("/{answer_id}")
def delete_wrong_answer(answer_id: str, user_id: str = Depends(get_current_user_id)):
    service.delete_wrong_answer(user_id, answer_id)
    return {"ok": True}


@router.delete("")
def clear_wrong_answers(game_id: WrongAnswerGameId | None = Query(None), user_id: str = Depends(get_current_user_id)):
    service.clear_wrong_answers(user_id, game_id)
    return {"ok": True}
