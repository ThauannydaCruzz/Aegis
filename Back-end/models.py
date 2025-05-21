from sqlalchemy import Column, Integer, String, LargeBinary, Boolean, Text
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    country = Column(String, nullable=False)
    face_encoding = Column(Text, nullable=True)  # JSON string da lista de floats
    agree_to_terms = Column(Boolean, default=False)