from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


#  database for user
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    # first_name: Mapped[str] = mapped_column(String(50)) - we probably won't use
    # last_name: Mapped[str] = mapped_column(String(50))  - these here
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    favorites = relationship("Favorites", back_populates="user")
    streak = relationship("Streak", back_populates="user")
    profile = relationship("Runner", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            # "firstName": self.first_name,
            # "lastName": self.last_name,
            "is_active": self.is_active,
            "favorites": self.favorites,
            "streak": self.streak,
            "profile": self.profile
            # do not serialize the password, its a security breach
        }

# This is the runner profile
class Runner(db.Model):
    __tablename__ = "runners"

    id = db.Column(db.Integer, primary_key=True)
    user_by_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    name = db.Column(db.String(120), nullable=False)    # This may be broken into first_name and last_name
    phone = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    years_running = db.Column(db.Integer, nullable=True)
    schedule = db.Column(db.String(200), nullable=True)
    location = db.Column(db.String(200), nullable=True)
    is_mentor = db.Column(db.Boolean(), nullable=False, default=False)
    user = relationship("User", back_populates="profile")

    def serialize(self):
        return {
            "id": self.id,
            "user_by_id": self.user_by_id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "address": self.address,
            "years_running": self.years_running,
            "schedule": self.schedule,
            "schedule": self.schedule,
            "is_mentor": self.is_mentor,
            "user": self.user
        }


# database for favorites
class Favorites(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    favorited_by_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user = relationship("User", back_populates="favorites")

    def serialize(self):
        return {
            "id": self.id,
            "favorited_by_id": self.favorited_by_id,
            "user": self.user
        }


# database that indicate the streak of the user or how often does the user run
class Streak(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    streak_by_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user = relationship("User", back_populates="streak")

    def serialize(self):
        return {
            "id": self.id,
            "streak_by_id": self.streak_by_id,
            "user": self.user
        }
