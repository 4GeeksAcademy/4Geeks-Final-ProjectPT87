from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

#  database for user
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    # runner_id: Mapped[int] = mapped_column(ForeignKey("runners.id"))
    username: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    runner_profile = relationship("Runner", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_active": self.is_active,
            "runner_profile": self.runner_profile,
            # do not serialize the password, its a security breach
        }

# This is the runner profile
class Runner(db.Model):
    __tablename__ = "runners"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    # This may be broken into first_name and last_name
    # name = db.Column(db.String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    # first_name: Mapped[str] = mapped_column(String(50)) - We may break up first and last name
    # last_name: Mapped[str] = mapped_column(String(50))
    # phone = db.Column(db.String(50), nullable=True)
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    # email = db.Column(db.String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    # address = db.Column(db.String(200), nullable=True)
    address: Mapped[str] = mapped_column(String(200), nullable=True)
    # years_running = db.Column(db.Integer, nullable=True)
    years_running: Mapped[int] = mapped_column(nullable=True)    # How do I limit int to 3 digits?
    # schedule = db.Column(db.String(200), nullable=True)
    schedule: Mapped[str] = mapped_column(String(200), nullable=True)
    # location = db.Column(db.String(200), nullable=True)
    location: Mapped[str] = mapped_column(String(200), nullable=True)
    # is_mentor = db.Column(db.Boolean(), nullable=False, default=False)
    is_mentor: Mapped[bool] = mapped_column(nullable=False, default=False)
    user = relationship("User", back_populates="runner_profile")
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
            "runner": target_runner.serialize()
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
