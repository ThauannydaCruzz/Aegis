from fastapi import FastAPI
from database import Base, engine
from routes import auth


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)