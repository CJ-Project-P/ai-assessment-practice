import pytest
from pydantic import ValidationError

from app.wrong_answers.schemas import WrongAnswerCreate


def test_shape_rotate_shape_accepted():
    entry = WrongAnswerCreate(
        game_id="shape-rotate",
        mode="learn",
        data={"kind": "grid", "cells": [1, 2, 3], "letter": "", "answerOps": ["rotate-left"], "userOps": ["flip-h"]},
    )
    assert entry.data["kind"] == "grid"


def test_food_memory_shape_accepted():
    entry = WrongAnswerCreate(
        game_id="food-memory", mode="practice", data={"correctItemId": "sushi", "selectedItemId": None}
    )
    assert entry.data["correctItemId"] == "sushi"


def test_bus_memory_shape_accepted():
    entry = WrongAnswerCreate(game_id="bus-memory", mode="learn", data={"correctNumber": 42, "selectedNumber": 7})
    assert entry.data["correctNumber"] == 42


def test_shape_sequence_shape_accepted():
    entry = WrongAnswerCreate(
        game_id="shape-sequence",
        mode="practice",
        data={
            "shape": "circle",
            "twoBack": "square",
            "threeBack": None,
            "correctAnswer": "left",
            "selectedAnswer": "right",
        },
    )
    assert entry.data["shape"] == "circle"


def test_mismatched_shape_rejected():
    with pytest.raises(ValidationError):
        WrongAnswerCreate(game_id="food-memory", mode="learn", data={"correctNumber": 1, "selectedNumber": None})


def test_potion_game_id_rejected():
    with pytest.raises(ValidationError):
        WrongAnswerCreate(game_id="potion", mode="learn", data={})
