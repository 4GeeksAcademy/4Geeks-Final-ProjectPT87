
import click
from api.models import db, User, Runner

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    # @app.cli.command("insert-test-data")
    # def insert_test_data():
    #     user_data = [
    #         {"name": "Patrick Andries",
    #          "username": "pandries",
    #          "phone": "918-366-3320",
    #          "email": "pandries@gmail.com",
    #          "address": "11777 S 85th E Ave",
    #          "years_running": 5,
    #          "schedule": "M-W-F",
    #          "location": "OK",
    #          "rating": 5,
    #          "level": 1,
    #          "is_mentor": False
    #         },
    #         {"name": "Jonathan Palma",
    #          "username": "jpalma"
    #          "phone": "301-366-3320",
    #          "email": "jpalma@gmail.com",
    #          "address": "11777 S 85th E Ave",
    #          "years_running": 5,
    #          "schedule": "M-W-F",
    #          "location": "FL",
    #          "rating": 5,
    #          "level": 10,
    #          "is_mentor": True
    #         },
    #         {"name": "Deony Lopez",
    #          "username": "dlopez"
    #          "phone": "542-366-3320",
    #          "email": "dlopez@gmail.com",
    #          "address": "11777 S 85th E Ave",
    #          "years_running": 7,
    #          "schedule": "M-W-F",
    #          "location": "FL",
    #          "rating": 5,
    #          "level": 5,
    #          "is_mentor": False
    #         },
    #         {"name": "Ozzie Garcia",
    #          "username": "ogarcia",
    #          "phone": "224-366-3320",
    #          "email": "ogarcia@gmail.com",
    #          "address": "11777 S 85th E Ave",
    #          "years_running": 7,
    #          "schedule": "M-W-F",
    #          "location": "IL",
    #          "rating": 5,
    #          "level": 5,
    #          "is_mentor": True
    #         },
    #         {"name": "Leonard Santiago",
    #          "username": "lsantiago"
    #          "phone": "714-366-3320",
    #          "email": "lsantiago@gmail.com",
    #          "address": "11777 S 85th E Ave",
    #          "years_running": 2,
    #          "schedule": "M-W-F",
    #          "location": "IL",
    #          "rating": 5,
    #          "level": 2,
    #          "is_mentor": False
    #         },
    #     ]
    #     print("Creating test users")
    #     for dict in user_data:
    #         new_user = User(
    #             username = dict["username"]
    #             email = dict["email"]
    #             _password = "password"
    #             is_active = True
    #         )

    #         db.session.add(new_user)
    #         db.session.commit()
    #         print("User: ", username, " created.")

    #     for dict in user_data:
    #         new_runner = Runner(
    #             name = dict["name"]
    #             phone = dict["phone"]
    #             email = dict["email"]
    #             address = dict["address"]
    #             running = dict["years_running"]
    #             schedule = dict["schedule"]
    #             location = dict["location"]
    #             rating = dict["rating"]
    #             level = dict["level"]
    #             s_mentor = dict["is_mentor"]
    #         )
    #
    #         db.session.add(new_runner)
    #         db.session.commit()
    #         print("Runner: ", runner.name, " created.")

    #     print("All test users created")