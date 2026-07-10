import pytest
from pydantic import ValidationError

from app.practice_records.schemas import PracticeRecordCreate


def test_valid_record_passes():
    record = PracticeRecordCreate(game_id="shape-rotate", total=10, correct=8)
    assert record.correct == 8


def test_correct_over_total_rejected():
    with pytest.raises(ValidationError):
        PracticeRecordCreate(game_id="shape-rotate", total=3, correct=10)


def test_unknown_game_id_rejected():
    with pytest.raises(ValidationError):
        PracticeRecordCreate(game_id="not-a-game", total=3, correct=1)
