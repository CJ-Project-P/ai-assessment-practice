from enum import Enum
from typing import Literal

from pydantic import BaseModel, model_validator


class WrongAnswerGameId(str, Enum):
    """오답 기록은 potion을 제외한 4개 게임만 남긴다 (potion은 오답 카드 UI가 없음)."""

    shape_rotate = "shape-rotate"
    shape_sequence = "shape-sequence"
    food_memory = "food-memory"
    bus_memory = "bus-memory"


# 게임별 오답(mistake) data 모양 — 프론트의 Mistake 타입과 1:1로 맞춘다.
Operation = Literal["rotate-left", "rotate-right", "flip-h", "flip-v"]
ShapeKind = Literal["grid", "letter"]
ShapeName = Literal["circle", "triangle", "square"]
SequenceAnswer = Literal["space", "left", "right"]


class ShapeRotateMistakeData(BaseModel):
    kind: ShapeKind
    cells: list[int]
    letter: str
    answerOps: list[Operation]
    userOps: list[Operation]


class FoodMistakeData(BaseModel):
    correctItemId: str
    selectedItemId: str | None


class BusMistakeData(BaseModel):
    correctNumber: int
    selectedNumber: int | None


class SequenceMistakeData(BaseModel):
    shape: ShapeName
    twoBack: ShapeName
    threeBack: ShapeName | None
    correctAnswer: SequenceAnswer
    selectedAnswer: SequenceAnswer | None


# game_id로 data를 검증할 모델을 고른다 (game_id와 data가 형제 필드라 discriminated union 대신 이렇게 처리).
WRONG_ANSWER_DATA_MODELS: dict[WrongAnswerGameId, type[BaseModel]] = {
    WrongAnswerGameId.shape_rotate: ShapeRotateMistakeData,
    WrongAnswerGameId.food_memory: FoodMistakeData,
    WrongAnswerGameId.bus_memory: BusMistakeData,
    WrongAnswerGameId.shape_sequence: SequenceMistakeData,
}


class WrongAnswerCreate(BaseModel):
    game_id: WrongAnswerGameId
    mode: Literal["learn", "practice"]
    data: dict

    @model_validator(mode="after")
    def validate_data_shape(self):
        model_cls = WRONG_ANSWER_DATA_MODELS[self.game_id]
        # 여기서 실패하면 ValidationError → FastAPI가 422로 응답한다.
        parsed = model_cls.model_validate(self.data)
        self.data = parsed.model_dump()
        return self


class WrongAnswerOut(BaseModel):
    id: str
    game_id: str
    mode: str
    data: dict
    created_at: str
