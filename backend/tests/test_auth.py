from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException

from app.auth import get_current_user_id


def test_no_bearer_prefix_raises_401():
    with pytest.raises(HTTPException) as exc:
        get_current_user_id(authorization="not-a-bearer-token")
    assert exc.value.status_code == 401


@patch("app.auth.supabase")
def test_valid_token_returns_user_id(mock_supabase):
    mock_supabase.auth.get_user.return_value = MagicMock(user=MagicMock(id="user-123"))
    assert get_current_user_id(authorization="Bearer valid-token") == "user-123"


@patch("app.auth.supabase")
def test_no_user_on_response_raises_401(mock_supabase):
    mock_supabase.auth.get_user.return_value = MagicMock(user=None)
    with pytest.raises(HTTPException) as exc:
        get_current_user_id(authorization="Bearer expired-or-invalid")
    assert exc.value.status_code == 401


@patch("app.auth.supabase")
def test_supabase_raising_raises_401(mock_supabase):
    mock_supabase.auth.get_user.side_effect = Exception("network error")
    with pytest.raises(HTTPException) as exc:
        get_current_user_id(authorization="Bearer whatever")
    assert exc.value.status_code == 401
