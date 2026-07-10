from pydantic import BaseModel, Field, model_validator

from app.games import GameId


class PracticeRecordCreate(BaseModel):
    game_id: GameId
    total: int = Field(ge=1)
    correct: int = Field(ge=0)

    @model_validator(mode="after")
    def check_correct_not_over_total(self):
        if self.correct > self.total:
            raise ValueError("correct는 total보다 클 수 없어요.")
        return self


class PracticeRecordOut(BaseModel):
    id: str
    game_id: str
    total: int
    correct: int
    created_at: str
