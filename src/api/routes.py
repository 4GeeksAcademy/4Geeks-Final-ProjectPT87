"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, flash, redirect
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, current_user
import hashlib
from api.models import db, User, Runner, Message


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def register():
    user = db.session.scalars(
        db.select(User).filter_by(username=request.json.get("username"))
    ).first()

    if user:
        return jsonify(msg="Invalid username or password."), 400

    user = User(**request.json, is_active=True)

    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)

    return jsonify(user.serialize())


@api.route('/login', methods=['POST'])
def login():
    user = db.session.scalars(
        db.select(User).filter_by(email=request.json.get("email"))
    ).first()
    if not all([
        user,
        getattr(user, "password", None) == request.json.get("password", "")
    ]):
        return jsonify("Invalid email or password."), 400

    return (jsonify(token=create_access_token(identity=user.id)))


# Not sure what this does yet, but it seems to be for getting the current user info based on the JWT token
@api.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify(user.serialize()), 200


# Gets all runners from the database and converts it into a list
@api.route('/list_runners', methods=['GET'])
def get_runners():
    runners = db.session.scalars(db.select(Runner)).all()
    return jsonify([runner.serialize() for runner in runners]), 200

# Route to create runner


@api.route('/list_runners', methods=['POST'])
@jwt_required()
def create_runner():
    body = request.json
    user_id = get_jwt_identity()
    
    new_runner = Runner(
        name=body.get("name"),
        phone=body.get("phone"),
        email=body.get("email"),
        address=body.get("address"),
        user_id=user_id
    )

    db.session.add(new_runner)

    db.session.commit()
    db.session.refresh(new_runner)

    return jsonify(new_runner.serialize()), 201


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
    body = request.json

    sender_id = get_jwt_identity()
    receiver_id = body.get("receiver_id")
    content = body.get("content")

    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=content
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
