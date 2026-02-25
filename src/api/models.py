from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean,ForeignKey,DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timezone, timedelta
import uuid
import hashlib



db = SQLAlchemy()


#  database for user
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    _password: Mapped[str] = mapped_column("password", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    favorites = relationship("Favorites", back_populates="user")
    streak = relationship("Streak", back_populates="user")
    def __repr__(self):
        return f"Username {self.username}"
    
    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, new_pass):
        self._password = generate_password_hash(new_pass)

    def check_password_hash(self, password):
        return check_password_hash(self.password, password)


    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Runner(db.Model):
    __tablename__ = "runners"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(200), nullable=False)

    # Added another database column for selecting runner or mentor for the user
    role = db.Column(
        db.Enum("runner", "mentor", name="role_types"),
        nullable=False,
        default="runner"
    )

    # below a relative option for typing in the role yourself instead of selecting if we want that instead of the enum option above
    # role = db.Column(db.String(20), nullable=False, default="runner")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "address": self.address,
            "role": self.role
        }


# database for favorites
class Favorites(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    favorited_by_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    user = relationship("User", back_populates="favorites")

    def serialize(self):
        return {
            "id": self.id,
            "favorited_by_id": self.favorited_by_id
        }


# database that indicate the streak of the user or how often does the user log in
class Streak(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    streak_by_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    user = relationship("User", back_populates="streak")

    def serialize(self):
        return {
            "id": self.id,
            "streak_by_id": self.streak_by_id
        }

class ResetPassword(db.Model):
    __tablename__ ="password_reset"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False, index=True)
    token_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True) 
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    expiry: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship("User")

    @staticmethod
    def generate(user_id, expiry_minutes=20):
        token = str(uuid.uuid4())   
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        record= ResetPassword(
            user_id= user_id,
            token_hash =token_hash,
            expiry=datetime.now(timezone.utc)+ timedelta(minutes=expiry_minutes)
        )
        return record, token
    
    @staticmethod
    def verify_token(token):
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        record = db.session.scalars(
            db.select(ResetPassword).filter_by(token_hash=token_hash)
        ).first()
        if not record:
            return None
        if record.used_at is not None:
            return None
        if record.expiry < datetime.now(timezone.utc):
            return None
        
        return record
    
    def used_token(self):
        self.used_at = datetime.now(timezone.utc)


# class Match(db.Model):

#     id: Mapped[int] = mapped_column(primary_key=True)
#     usera_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False, index=True)
#     userb_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False, index=True)
#     match:  Mapped[str] = mapped_column(String(60), nullable=False, unique=True, index=True)
#     is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
