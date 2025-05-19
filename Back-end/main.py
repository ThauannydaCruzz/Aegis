from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, Boolean, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from dotenv import load_dotenv
import os

# CORS
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "chave_insegura_padrao")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    country = Column(String)
    agree_to_terms = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    country: str
    agreeToTerms: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    country: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

app = FastAPI()

# New
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user(db, email: str):
    email = email.lower()  # força lowercase
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

@app.post("/register", response_model=UserOut)
def register(user: UserCreate):
    db = SessionLocal()
    try:
        # força o email para lowercase para evitar duplicidade com maiúsculas/minúsculas
        user_email = user.email.lower()
        db_user = get_user(db, user_email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email já cadastrado")
        hashed_password = get_password_hash(user.password)
        db_user = User(
            first_name=user.firstName,
            last_name=user.lastName,
            email=user_email,
            hashed_password=hashed_password,
            country=user.country,
            agree_to_terms=user.agreeToTerms,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return UserOut(
            firstName=db_user.first_name,
            lastName=db_user.last_name,
            email=db_user.email,
            country=db_user.country
        )
    finally:
        db.close()

@app.post("/login", response_model=Token)
def login(login_req: LoginRequest):
    db = SessionLocal()
    try:
        user = authenticate_user(db, login_req.email, login_req.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        db.close()
