from supabase import Client, create_client

from app.config import SUPABASE_SECRET_KEY, SUPABASE_URL

# 시크릿(서비스 롤) 키로 만든 서버 전용 클라이언트라 RLS를 우회한다.
# 그래서 "이 행이 진짜 이 유저 것인지"는 여기서 만든 쿼리마다 우리가 직접 검사해야 한다 (app/auth.py + 각 라우터 참고).
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
