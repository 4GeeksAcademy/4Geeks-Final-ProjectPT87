"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, flash, redirect
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, current_user
import hashlib


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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
    db.select(User).filter_by(username = request.json.get("username"))
    ).first()
    if not all([
        user,
        getattr(user, "password", None) == request.json.get("password", "")
    ]):
        return jsonify("Invalid username or password."),400
    
    return (jsonify(token=create_access_token(identity=user)
    ))

@api.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    uid = get_jwt_identity()
    user = User.query.filter_by(id=uid).first()
    return jsonify(user.serialize())