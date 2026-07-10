from unittest.mock import patch

from app.wrong_answers import service

FAKE_ENTRY = {
    "id": "wa-1",
    "game_id": "bus-memory",
    "mode": "learn",
    "data": {"correctNumber": 42, "selectedNumber": 7},
    "created_at": "2026-01-01T00:00:00+00:00",
}


def test_create_wrong_answer(client):
    with patch.object(service, "create_wrong_answer", return_value=FAKE_ENTRY) as mocked:
        res = client.post(
            "/wrong-answers",
            json={"game_id": "bus-memory", "mode": "learn", "data": {"correctNumber": 42, "selectedNumber": 7}},
        )
    assert res.status_code == 200
    assert res.json() == FAKE_ENTRY
    mocked.assert_called_once()


def test_list_wrong_answers(client):
    with patch.object(service, "list_wrong_answers", return_value=[FAKE_ENTRY]):
        res = client.get("/wrong-answers")
    assert res.status_code == 200
    assert res.json() == [FAKE_ENTRY]


def test_clear_wrong_answers_by_game(client):
    with patch.object(service, "clear_wrong_answers", return_value=None) as mocked:
        res = client.delete("/wrong-answers?game_id=bus-memory")
    assert res.status_code == 200
    assert res.json() == {"ok": True}
    mocked.assert_called_once()


def test_potion_rejected_before_reaching_service(client):
    with patch.object(service, "create_wrong_answer") as mocked:
        res = client.post("/wrong-answers", json={"game_id": "potion", "mode": "learn", "data": {}})
    assert res.status_code == 422
    mocked.assert_not_called()


def test_mismatched_data_shape_rejected(client):
    with patch.object(service, "create_wrong_answer") as mocked:
        res = client.post(
            "/wrong-answers",
            json={"game_id": "food-memory", "mode": "learn", "data": {"correctNumber": 1, "selectedNumber": None}},
        )
    assert res.status_code == 422
    mocked.assert_not_called()
