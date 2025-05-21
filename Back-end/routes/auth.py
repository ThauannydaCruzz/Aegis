<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app import database, models, schemas, auth as auth_utils
import face_recognition
import numpy as np
import io
import json

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Cadastro tradicional
@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=user.email).first():
        raise HTTPException(status_code=409, detail="Email já cadastrado")
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=auth_utils.get_password_hash(user.password),
        country=user.country,
        agree_to_terms=user.agree_to_terms,
        face_encoding=None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "Cadastro realizado com sucesso!"}

# Login tradicional
@router.post("/login")
def login(creds: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=creds.email).first()
    if not user or not auth_utils.verify_password(creds.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = auth_utils.create_access_token({"sub": user.email})
    return {"access_token": token}

# Cadastro com reconhecimento facial
@router.post("/register-face")
async def register_face(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    country: str = Form(...),
    agree_to_terms: str = Form(...),
    face_image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if db.query(models.User).filter_by(email=email).first():
        raise HTTPException(status_code=409, detail="Email já cadastrado")
    image_bytes = await face_image.read()
    image = face_recognition.load_image_file(io.BytesIO(image_bytes))
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        raise HTTPException(status_code=400, detail="Nenhum rosto detectado")
    face_encoding = json.dumps(encodings[0].tolist())
    db_user = models.User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=auth_utils.get_password_hash(password),
        country=country,
        agree_to_terms=agree_to_terms.lower() == "true",
        face_encoding=face_encoding
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "Cadastro facial realizado com sucesso!"}

# Login com reconhecimento facial
@router.post("/login-face")
async def login_face(face_image: UploadFile = File(...), db: Session = Depends(get_db)):
    image_bytes = await face_image.read()
    image = face_recognition.load_image_file(io.BytesIO(image_bytes))
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        raise HTTPException(status_code=400, detail="Nenhum rosto detectado")
    input_encoding = encodings[0]
    users = db.query(models.User).filter(models.User.face_encoding.isnot(None)).all()
    for user in users:
        known_encoding = np.array(json.loads(user.face_encoding))
        match = face_recognition.compare_faces([known_encoding], input_encoding)[0]
        if match:
            token = auth_utils.create_access_token({"sub": user.email})
            return {"access_token": token}
    raise HTTPException(status_code=401, detail="Rosto não reconhecido")
=======
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
>>>>>>> b61f4638d4934fce659e8ebce08f9e0e46ba6d16
