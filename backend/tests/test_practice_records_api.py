from unittest.mock import patch

from app.practice_records import service

FAKE_RECORD = {
    "id": "rec-1",
    "game_id": "shape-rotate",
    "total": 10,
    "correct": 8,
    "created_at": "2026-01-01T00:00:00+00:00",
}


def test_create_practice_record(client):
    with patch.object(service, "create_practice_record", return_value=FAKE_RECORD) as mocked:
        res = client.post("/practice-records", json={"game_id": "shape-rotate", "total": 10, "correct": 8})
    assert res.status_code == 200
    assert res.json() == FAKE_RECORD
    mocked.assert_called_once()


def test_list_practice_records(client):
    with patch.object(service, "list_practice_records", return_value=[FAKE_RECORD]):
        res = client.get("/practice-records")
    assert res.status_code == 200
    assert res.json() == [FAKE_RECORD]


def test_delete_practice_record(client):
    with patch.object(service, "delete_practice_record", return_value=None) as mocked:
        res = client.delete("/practice-records/rec-1")
    assert res.status_code == 200
    assert res.json() == {"ok": True}
    mocked.assert_called_once_with("11111111-1111-1111-1111-111111111111", "rec-1")


def test_invalid_body_rejected_before_reaching_service(client):
    with patch.object(service, "create_practice_record") as mocked:
        res = client.post("/practice-records", json={"game_id": "shape-rotate", "total": 3, "correct": 10})
    assert res.status_code == 422
    mocked.assert_not_called()


def test_missing_auth_rejected(anon_client):
    res = anon_client.get("/practice-records")
    assert res.status_code == 422
