"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, flash, redirect
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, current_user
import hashlib
from api.models import db, User, Runner



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def register(): 
    user = db.session.scalars(
        db.select(User).filter_by(username = request.json.get("username"))
    ).first()

    if user:
        return jsonify(msg="Invalid username or password."),400
    

    
    user= User(**request.json, is_active =True)

    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)

    return jsonify(user.serialize())



@api.route('/login', methods=['POST'])
def login(): 
    user = db.session.scalars(
    db.select(User).filter_by(email = request.json.get("email"))
    ).first()
    if not all([
        user,
        getattr(user, "password", None) == request.json.get("password", "")
    ]):
        return jsonify("Invalid email or password."),400
    
    return (jsonify(token=create_access_token(user)
    ))

# Gets all runners from the database and converts it into a list
@api.route('/runners', methods=['GET'])
def get_runners():
    runners = db.session.scalars(db.select(Runner)).all()
    return jsonify([runner.serialize() for runner in runners]), 200

# Route to create runner 
@api.route('/runners', methods=['POST'])
def create_runner():
    body = request.json

    new_runner = Runner(
        name=body.get("name"),
        phone=body.get("phone"),
        email=body.get("email"),
        address=body.get("address")
    )

    db.session.add(new_runner)
    db.session.commit()
    db.session.refresh(new_runner)

    return jsonify(new_runner.serialize()), 201



@api.route('/runners/<int:runner_id>', methods=['PUT'])
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


@api.route('/runners/<int:runner_id>', methods=['DELETE'])
def delete_runner(runner_id):
    runner = db.session.get(Runner, runner_id)

    if not runner:
        return jsonify({"msg": "Runner not found"}), 404

    db.session.delete(runner)
    db.session.commit()

    return jsonify({"msg": "Runner deleted"}), 200




# @api.route('/user', methods=['GET'])
# @jwt_required()
# def get_user():
#     uid = get_jwt_identity()
#     user = User.query.filter_by(id=uid).first()
#     return jsonify(user.serialize())