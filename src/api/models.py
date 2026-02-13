from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


#  database for user
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.first_name,
            "lastName": self.last_name
            # do not serialize the password, its a security breach
        }

# database for favorites
    class favorites(db.Model):
        id: Mapped[int] = mapped_column(primary_key=True)
        favorited_by_id: Mapped[int] = mapped_column(foreign_key(User.id))

        def serialize(self):
            return {
                "id": self.id,
                "favorited_by_id": self.favorited_by_id
            }

# database that indicate the streak of the user or how often does the user log in
    class streak(db.Model):
        id: Mapped[int] = mapped_column(primary_key=True)
        streak_by_id: Mapped[int] = mapped_column(foreign_key(User.id))

        def serialize(self):
            return {
                "id": self.id,
                "streak_by_id": self.streak_by_id
            }
