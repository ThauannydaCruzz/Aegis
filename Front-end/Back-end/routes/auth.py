from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext
from schemas import RegisterSchema, LoginSchema, UserResponseSchema
from models.user import User
from database import get_db
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
if not SECRET_KEY:
    raise ValueError("SECRET_KEY não configurada!")

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register", response_model=UserResponseSchema)
def register_user(data: RegisterSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado."
        )
    
    hashed_password = get_password_hash(data.password)
    new_user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        hashed_password=hashed_password,
        country=data.country,
        agree_to_terms=data.agree_to_terms,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login_user(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas."
        )
    
    # Gerar token JWT
    token = jwt.encode({"sub": user.email}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}