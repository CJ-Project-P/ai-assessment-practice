from fastapi import Header, HTTPException

from app.supabase_client import supabase


# 라우터에서 Depends(get_current_user_id)로 주입해서 쓴다 (Spring SecurityContext에서
# 로그인 유저 꺼내는 것과 비슷한 역할). 토큰 검증은 Supabase Auth 서버에 위임한다.
def get_current_user_id(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization 헤더가 없어요.")

    token = authorization.removeprefix("Bearer ").strip()

    try:
        result = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰이에요.")

    if result is None or result.user is None:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰이에요.")

    return result.user.id
