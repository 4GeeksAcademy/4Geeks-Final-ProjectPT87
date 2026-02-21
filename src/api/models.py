from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


#  database for user
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    # username: Mapped[str] = mapped_column(
    #    String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    # first_name: Mapped[str] = mapped_column(String(50))
    # last_name: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    favorites = relationship("Favorites", back_populates="user")
    streak = relationship("Streak", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            # "firstName": self.first_name,
            # "lastName": self.last_name,
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
            "role": self.role,
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
