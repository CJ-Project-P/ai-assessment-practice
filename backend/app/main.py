from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.practice_records.controller import router as practice_records_router
from app.wrong_answers.controller import router as wrong_answers_router

app = FastAPI(title="ai-assessment-practice-backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(practice_records_router)
app.include_router(wrong_answers_router)


@app.get("/health")
def health():
    return {"status": "ok"}
