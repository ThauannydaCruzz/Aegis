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