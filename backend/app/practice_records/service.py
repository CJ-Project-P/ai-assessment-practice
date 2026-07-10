from app.games import GameId
from app.practice_records.schemas import PracticeRecordCreate
from app.supabase_client import supabase

TABLE = "practice_records"


def create_practice_record(user_id: str, body: PracticeRecordCreate) -> dict:
    row = {
        "user_id": user_id,
        "game_id": body.game_id.value,
        "total": body.total,
        "correct": body.correct,
    }
    result = supabase.table(TABLE).insert(row).execute()
    return result.data[0]


def list_practice_records(user_id: str, game_id: GameId | None) -> list[dict]:
    # RLS는 secret key로 우회됐으니, 여기 eq("user_id", ...)가 실제 권한 경계다.
    query = supabase.table(TABLE).select("*").eq("user_id", user_id).order("created_at")
    if game_id is not None:
        query = query.eq("game_id", game_id.value)
    return query.execute().data


def delete_practice_record(user_id: str, record_id: str) -> None:
    supabase.table(TABLE).delete().eq("id", record_id).eq("user_id", user_id).execute()


def clear_practice_records(user_id: str, game_id: GameId | None) -> None:
    query = supabase.table(TABLE).delete().eq("user_id", user_id)
    if game_id is not None:
        query = query.eq("game_id", game_id.value)
    query.execute()
