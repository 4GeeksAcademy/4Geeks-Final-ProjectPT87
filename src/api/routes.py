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
# unique_id = uuid.uuid4

# Allow CORS requests to this API
CORS(api)


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
    print (f"User {user} logged in successfully.")

    return (jsonify(token=create_access_token(user))
                    ), 200


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
