"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from api.models import db, User, ResetPassword, Runner, Favorites, Message
from flask import Flask, request, jsonify, url_for, Blueprint, flash, redirect
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import os
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, current_user
import hashlib


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
STRAVA_API = "https://www.strava.com/api/v3"
STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token"

def is_run(a):
    return a.get("sport_type") == "Run" or a.get("type") == "Run"


@api.route('/register', methods=['POST'])
def register():
    user = db.session.scalars(
        db.select(User).filter_by(username=request.json.get("username"))
    ).first()

    if user:
        return jsonify(msg="Username already taken."), 400

    data = request.json

    user = User(username=data["username"], email=data["email"],
                password=data["password"], is_active=True)

    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)

    return jsonify(user.serialize())

# Login


@api.route('/login', methods=['POST'])
def login():
    user = db.session.scalars(
        db.select(User).filter_by(email=request.json.get("email"))
    ).first()

    if not user or not user.check_password_hash(request.json.get("password", "")):
        return jsonify(msg="Invalid email or password."), 400
    
    return jsonify(token=create_access_token(identity=str(user.id))), 200
    

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({"msg": "Logged out succesfully."}), 200


@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get("email")
    user = db.session.scalars(db.select(User).filter_by(email=email)).first()
    if not user:
        return jsonify({"msg": "A link has been sent to your email."}), 200

    record, token = ResetPassword.generate(user.id)
    db.session.add(record)
    db.session.commit()

    reset_url = f"{os.environ.get('FRONTEND_URL')}/reset-password/{token}"
    print(f"[DEV ONLY] Reset link: {reset_url}")

    return jsonify(msg="A reset link has been sent."), 200


@api.route('/reset-password/<token>', methods=['POST'])
def reset_password_token(token):
    new_password = request.json.get("password")
    if not new_password or len(new_password) < 8:
        return jsonify({"msg": "Password must be at least 8 characters."}), 400

    record = ResetPassword.verify_token(token)
    if not record:
        return jsonify(msg="Invalid or expired token."), 400

    record.user.password = new_password
    record.used_token()
    db.session.commit()

    return jsonify(msg="Password reset successful."), 200

# Gets all runners from the database and converts it into a list


@api.route('/list_runners', methods=['GET'])
def get_runners():
    runners = db.session.scalars(db.select(Runner)).all()
    print([runner.serialize() for runner in runners])
    return jsonify([runner.serialize() for runner in runners]), 200

# Route to create runner

# Createrunner current error is subject must be a string
# The error has to do with line 115 with the variable user


@api.route('/list_runners', methods=['POST'])
@jwt_required()
def create_runner():
    body = request.json
    # This route needs to be authenticated so that you can tell who's logged in
    print("Request body:", body)
    user = get_jwt_identity()
    print("Creating runner for user_id:", user)
    new_runner = Runner(
        user_id=int(user),
        name=body.get("name"),
        phone=body.get("phone"),
        email=body.get("email"),
        address=body.get("address"),
        years_running=body.get("years_running"),
        schedule=body.get("schedule"),
        location=body.get("location"),
        rating=body.get("rating"),
        level=body.get("level"),
        is_mentor=body.get("is_mentor"),
    )

    db.session.add(new_runner)
    db.session.commit()
    db.session.refresh(new_runner)

    return jsonify({"message": "Runner created successfully"}), 201


@api.route('/list_runners/<int:runner_id>', methods=['PUT'])
def update_runner(runner_id):
    runner = db.session.get(Runner, runner_id)

    if not runner:
        return jsonify({"msg": "Runner not found"}), 404

    body = request.json

    runner.name = body.get("name", runner.name)
    runner.phone = body.get("phone", runner.phone)
    runner.email = body.get("email", runner.email)
    runner.address = body.get("address", runner.address)
    runner.years_running = body.get("years_running", runner.years_running)
    runner.schedule = body.get("schedule", runner.schedule)
    runner.location = body.get("location", runner.location)
    runner.rating = body.get("rating", runner.rating)
    runner.level = body.get("level", runner.level)
    runner.is_mentor = body.get("is_mentor", runner.is_mentor)

    db.session.commit()

    return jsonify(runner.serialize()), 200


@api.route('/list_runners/<int:runner_id>', methods=['DELETE'])
def delete_runner(runner_id):
    runner = db.session.get(Runner, runner_id)

    if not runner:
        return jsonify({"msg": "Runner not found"}), 404

    db.session.delete(runner)
    db.session.commit()

    return jsonify({"msg": "Runner deleted"}), 200


@api.route('/favorite_runner', methods=['GET'])
@jwt_required()
def get_favorites():
    user = get_jwt_identity()
    print('This is the token info: ', user)
    found_user = User.query.get(user)
    # print('This is the found user:', found_user.runner.serialize())
    favorites = Favorites.query.filter_by(source_runner_id = found_user.runner.id).all()
    # favorites = db.session.scalars(db.select(Favorites)).all() - our original format
    print([favorite.serialize() for favorite in favorites])
    return jsonify([favorite.serialize() for favorite in favorites]), 200

# This is the route to create a favorite
# This route needs to be authenticated so that you can tell who's logged in
@api.route('/favorite_runner', methods=['POST'])
@jwt_required()
def favorite_runner():
    body = request.jsona
    print("Request body:", body)
    user = get_jwt_identity()

    # You need to check if a favorite for this already exists!
    # And if so, then return early.

    print("Creating favorited runner for user_id:", user)
    favorited_runner = Favorites(
        source_runner_id=int(user),  # should be: current_user.runner.id
        target_runner_id=body.get("runner"),
    )

    db.session.add(favorited_runner)
    db.session.commit()
    db.session.refresh(favorited_runner)

    return jsonify({"message": "Runner favorited successfully"}), 200

# This is the route to delete a favorite
# This route needs to be authenticated so that you can tell who's logged in
@api.route('/favorite_runner/<int:target_runner_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(target_runner_id):
    # body = request.json
    # print("Request body:", body)
    user = get_jwt_identity()
    # print("Deleting favorited runner for user_id:", user)
    print('This is target runner id:',target_runner_id)
    print('User:', user)
    # runner = db.session.get(Favorites, target_runner_id)
    # runner = db.session.get(
    #     source_runner_id=int(1),  # should be: current_user.runner.id
    #     target_runner_id=target_runner_id,
    # )
    runner = db.session.execute(
        db.select(Favorites).where(
            Favorites.source_runner_id == user,
            Favorites.target_runner_id == target_runner_id
        )
    ).scalar_one_or_none()
    
    print('This is the runner we got:', runner)

    db.session.delete(runner)
    db.session.commit()
    # db.session.refresh(favorited_runner)

    return jsonify({"message": "Favorited runner deleted successfully"}), 200

# This is a copy for reference
# @api.route('/list_runners/<int:runner_id>', methods=['DELETE'])
# def delete_runner(runner_id):
#     runner = db.session.get(Runner, runner_id)

#     if not runner:
#         return jsonify({"msg": "Runner not found"}), 404

#     db.session.delete(runner)
#     db.session.commit()

#     return jsonify({"msg": "Runner deleted"}), 200

# Messages database
@api.route("/messages", methods=["POST"])
@jwt_required()
def send_message():
    current_user = get_jwt_identity()
    body = request.json

    new_message = Message(
        sender_id=current_user,  # Assuming you have the sender's user ID from the JWT token
        receiver_id=body.get("receiver_id"),
        content=body.get("content")
    )

    db.session.add(new_message)
    db.session.commit()

    return jsonify(new_message.serialize()), 201


@api.route("/messages/<int:user1>/<int:user2>", methods=["GET"])
def get_conversation(user1, user2):

    messages = db.session.query(Message).filter(
        ((Message.sender_id == user1) & (Message.receiver_id == user2)) |
        ((Message.sender_id == user2) & (Message.receiver_id == user1))
    ).order_by(Message.timestamp).all()

    return jsonify([m.serialize() for m in messages]), 200


# @api.route('/user', methods=['GET'])
# @jwt_required()
# def get_user():
#     uid = get_jwt_identity()
#     user = User.query.filter_by(id=uid).first()
#     return jsonify(user.serialize())
def get_valid_strava_access_token(user_id):
    token_row = db.session.scalars(
        db.select(StravaToken).filter_by(user_id=user_id)
    ).first()

    if not token_row:
        return None

    return token_row.access_token

@api.route("/strava/login-url", methods=["GET"])
@jwt_required()
def strava_login_url():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="User not found."), 401

    url = (
        "https://www.strava.com/oauth/authorize"
        f"?client_id={os.getenv('STRAVA_CLIENT_ID')}"
        f"&response_type=code"
        f"&redirect_uri={os.getenv('STRAVA_REDIRECT_URI')}"
        f"&approval_prompt=auto"
        f"&scope=read,activity:read_all,activity:write"
        f"&state={user_id}"
    )

    return jsonify(auth_url=url), 200

@api.route("/strava/callback", methods=["GET"])
def strava_callback():
    code = request.args.get("code")
    user_id = request.args.get("state")

    if not code or not user_id:
        return jsonify(msg="Missing code or state."), 400

    res = requests.post(
        STRAVA_TOKEN_URL,
        data={
            "client_id": os.getenv("STRAVA_CLIENT_ID"),
            "client_secret": os.getenv("STRAVA_CLIENT_SECRET"),
            "code": code,
            "grant_type": "authorization_code",
        },
        timeout=20,
    )

    if not res.ok:
        return jsonify(msg="Token exchange failed.", details=res.text), 400

    data = res.json()
    user_id = int(user_id)

    token_row = db.session.scalars(
        db.select(StravaToken).filter_by(user_id=user_id)
    ).first()

    if not token_row:
        token_row = StravaToken(
            user_id=user_id,
            access_token=data["access_token"],
            refresh_token=data["refresh_token"],
        )
        db.session.add(token_row)
    else:
        token_row.access_token = data["access_token"]
        token_row.refresh_token = data["refresh_token"]

    db.session.commit()

    return redirect(f"{os.getenv('FRONTEND_URL')}/strava?connected=true")

@api.route("/strava/status", methods=["GET"])
@jwt_required()
def strava_status():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="User not found."), 401

    token_row = db.session.scalars(
        db.select(StravaToken).filter_by(user_id=user_id)
    ).first()

    return jsonify(connected=bool(token_row)), 200

@api.route("/strava/runs", methods=["GET"])
@jwt_required()
def strava_runs():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="User not found."), 401

    access_token = get_valid_strava_access_token(user_id)
    if not access_token:
        return jsonify(msg="Strava not connected."), 401

    res = requests.get(
        f"{STRAVA_API}/athlete/activities",
        headers={"Authorization": "Bearer " + access_token},
        params={"per_page": 30, "page": 1},
        timeout=20,
    )

    if not res.ok:
        return jsonify(msg="Strava request failed."), 400

    runs = [a for a in res.json() if is_run(a)]
    return jsonify(runs), 200

@api.route("/strava/create-run", methods=["POST"])
@jwt_required()
def strava_create_run():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify(msg="User not found."), 401

    access_token = get_valid_strava_access_token(user_id)
    if not access_token:
        return jsonify(msg="Strava not connected."), 401

    body = request.json or {}

    name = body.get("name")
    start_date_local = body.get("start_date_local")
    elapsed_time = body.get("elapsed_time")
    distance = body.get("distance")

    if not name or not start_date_local or not elapsed_time or not distance:
        return jsonify(msg="Missing fields."), 400

    res = requests.post(
        f"{STRAVA_API}/activities",
        headers={"Authorization": "Bearer " + access_token},
        data={
            "name": name,
            "sport_type": "Run",
            "start_date_local": start_date_local,
            "elapsed_time": int(elapsed_time),
            "distance": float(distance),
        },
        timeout=20,
    )

    if not res.ok:
        return jsonify(msg="Create failed."), 400

    return jsonify(res.json()), 201