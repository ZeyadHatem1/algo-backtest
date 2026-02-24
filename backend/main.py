from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from data.models import Base
import os
from api.routes import router
app.include_router(router)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/backtest")
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Algo Backtest Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Backtest engine running"}