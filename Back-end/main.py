from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database, models
from app.routes import auth

app = FastAPI()

# CORS para frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Altere para URL do front em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria tabelas no banco
models.Base.metadata.create_all(bind=database.engine)

# Rotas de autenticação
app.include_router(auth.router)