from app.supabase_client import supabase
from app.wrong_answers.schemas import WrongAnswerCreate, WrongAnswerGameId

TABLE = "wrong_answers"


def create_wrong_answer(user_id: str, body: WrongAnswerCreate) -> dict:
    row = {
        "user_id": user_id,
        "game_id": body.game_id.value,
        "mode": body.mode,
        "data": body.data,
    }
    result = supabase.table(TABLE).insert(row).execute()
    return result.data[0]


def list_wrong_answers(user_id: str, game_id: WrongAnswerGameId | None) -> list[dict]:
    query = supabase.table(TABLE).select("*").eq("user_id", user_id).order("created_at", desc=True)
    if game_id is not None:
        query = query.eq("game_id", game_id.value)
    return query.execute().data


def delete_wrong_answer(user_id: str, answer_id: str) -> None:
    supabase.table(TABLE).delete().eq("id", answer_id).eq("user_id", user_id).execute()


def clear_wrong_answers(user_id: str, game_id: WrongAnswerGameId | None) -> None:
    query = supabase.table(TABLE).delete().eq("user_id", user_id)
    if game_id is not None:
        query = query.eq("game_id", game_id.value)
    query.execute()
