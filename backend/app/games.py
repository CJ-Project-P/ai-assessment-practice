from enum import Enum


class GameId(str, Enum):
    """프론트 src/lib/games.ts의 GameId와 동일하게 맞춘다. 여러 도메인이 같이 쓰는 값이라 최상위에 둔다."""

    shape_rotate = "shape-rotate"
    potion = "potion"
    shape_sequence = "shape-sequence"
    food_memory = "food-memory"
    bus_memory = "bus-memory"
