from fastapi import FastAPI
<<<<<<< HEAD
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
=======
from database import Base, engine
from routes import auth


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
>>>>>>> b61f4638d4934fce659e8ebce08f9e0e46ba6d16
