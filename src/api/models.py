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
    runner = relationship("Runner", back_populates="user")
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
            "is_active": self.is_active,
            "runner": self.runner,
            # do not serialize the password, its a security breach
        }

# This is the runner profile
class Runner(db.Model):
    __tablename__ = "runners"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    # This may be broken into first_name and last_name
    # first_name: Mapped[str] = mapped_column(String(50))
    # last_name: Mapped[str] = mapped_column(String(50))
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    address: Mapped[str] = mapped_column(String(200), nullable=True)
    years_running: Mapped[int] = mapped_column(nullable=True)    # How do I limit int to 3 digits?
    schedule: Mapped[str] = mapped_column(String(200), nullable=True)
    location: Mapped[str] = mapped_column(String(200), nullable=True)
    rating: Mapped[str] = mapped_column(String(50), nullable=True)
    level: Mapped[str] = mapped_column(String(50), nullable=True)
    is_mentor: Mapped[bool] = mapped_column(nullable=False, default=False)
    
    user = relationship("User", back_populates="runner")
    
    favorites = relationship(
        "Favorites", uselist=True,
        primaryjoin="Runner.id == Favorites.source_runner_id",
    )
    streak = relationship(
        "Streak", back_populates="user",
        primaryjoin="Streak.streak_by_id == Runner.id",
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            # "firstName": self.first_name, - these are here in case we want to use them
            # "lastName": self.last_name,
            "phone": self.phone,
            "email": self.email,
            "address": self.address,
            "years_running": self.years_running,
            "schedule": self.schedule,
            "location": self.location,
            "rating": self.rating,
            "level": self.level,
            "is_mentor": self.is_mentor,
            
            "user": self.user,
            "fav_runners": [fav.serialize() for fav in self.favorites]
        }


# database for favorites
# Runners can favorite other runners and mentors
class Favorites(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    # this is the runner who is favoriting
    source_runner_id: Mapped[int] = mapped_column(ForeignKey("runners.id"))
    source_runner = relationship(
        "Runner", back_populates="favorites",
        primaryjoin="Runner.id == Favorites.source_runner_id",
    )
    # this is the runner who is being favorited
    target_runner_id: Mapped[int] = mapped_column(ForeignKey("runners.id"))
    target_runner = relationship(
        "Runner",
        primaryjoin="Runner.id == Favorites.target_runner_id",
    )

    def serialize(self):
        return {
            "id": self.id,
            "runner": self.target_runner.serialize()
        }


# database that indicate the streak of the user or how often the user runs
class Streak(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    streak_by_id: Mapped[int] = mapped_column(ForeignKey("runners.id"))
    user = relationship(
        "Runner", back_populates="streak",
        primaryjoin="Streak.streak_by_id == Runner.id",
    )

    def serialize(self):
        return {
            "id": self.id,
            "streak_by_id": self.streak_by_id,
            "user": self.user
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
