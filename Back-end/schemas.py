from pydantic import BaseModel, EmailStr

class RegisterUser(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    country: str
    agree_to_terms: bool

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    country: str

    class Config:
        orm_mode = True
