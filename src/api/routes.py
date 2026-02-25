"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, ResetPassword, Runner
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required
import os

api = Blueprint('api', __name__)
# unique_id = uuid.uuid4

# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def register(): 
    user = db.session.scalars(
        db.select(User).filter_by(username = request.json.get("username"))
    ).first()

    if user:
        return jsonify(msg="Username already taken."),400
    
    data = request.json

    user= User(username =data["username"], email=data["email"], password=data["password"], is_active =True)

    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)

    return jsonify(user.serialize())



@api.route('/login', methods=['POST'])
def login(): 
    user = db.session.scalars(
    db.select(User).filter_by(email = request.json.get("email"))
    ).first()
    
    if not user or not user.check_password_hash(request.json.get("password", "")):
        return jsonify(msg="Invalid email or password."), 400
    
    return (jsonify(token=create_access_token(user)
    ))

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({"msg": "Logged out succesfully."}), 200


@api.route('/forgot-password', methods= ['POST'])
def forgot_password():
    email = request.json.get("email")
    user = db.session.scalars(db.select(User).filter_by(email=email)).first()
    if not user:
        return jsonify({"msg":"A link has been sent to your email."}),200
    
    record, token = ResetPassword.generate(user.id)
    db.session.add(record)
    db.session.commit()


    reset_url = f"{os.environ.get('FRONTEND_URL')}/reset-password/{token}"
    print(f"[DEV ONLY] Reset link: {reset_url}")

    return jsonify(msg="A reset link has been sent."), 200
    

@api.route('/reset-password/<token>', methods =['POST'])
def reset_password_token(token):
    new_password = request.json.get("password")
    if not new_password or len(new_password) < 8:
        return jsonify({"msg": "Password must be at least 8 characters."}),400
    
    record = ResetPassword.verify_token(token)
    if not record:
        return jsonify(msg="Invalid or expired token."), 400

    record.user.password = new_password  
    record.used_token()
    db.session.commit()

    return jsonify(msg="Password reset successful."), 200

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

