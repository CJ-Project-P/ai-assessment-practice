import pytest
from fastapi.testclient import TestClient

from app.auth import get_current_user_id
from app.main import app

TEST_USER_ID = "11111111-1111-1111-1111-111111111111"


@pytest.fixture
def client():
    # 실제 Supabase 토큰 없이 테스트하려고, 인증 dependency를 고정 user_id로 바꿔치기한다.
    app.dependency_overrides[get_current_user_id] = lambda: TEST_USER_ID
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def anon_client():
    """인증 override 없는 순정 클라이언트 (인증 실패 케이스 테스트용)."""
    return TestClient(app)
