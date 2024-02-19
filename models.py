# models.py

from config import db, ma
from marshmallow_sqlalchemy import fields
from marshmallow import INCLUDE


class Model(db.Model):
    __tablename__ = "model"
    model_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    model = db.Column(db.String)
    color = db.Column(db.String)
    cost = db.Column(db.Integer)
    weight = db.Column(db.Integer)


class ModelSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Model
        load_instance = True
        sqla_session = db.session
        include_fk = True


class Customer(db.Model):
    __tablename__ = "customer"
    customer_code = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    phone = db.Column(db.String)
    city = db.Column(db.String)
    street = db.Column(db.String)
    build = db.Column(db.Integer)


class CustomerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Customer
        load_instance = True
        sqla_session = db.session
        include_fk = True


class Contract(db.Model):
    __tablename__ = "contract"
    contract_num = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_code = db.Column(db.Integer, db.ForeignKey("customer.customer_code"))
    reg_date = db.Column(db.String)
    done_date = db.Column(db.String)


class ContractSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Contract
        load_instance = True
        sqla_session = db.session
        include_fk = True


class Sale(db.Model):
    __tablename__ = "sale"
    sale_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model_id = db.Column(db.Integer, db.ForeignKey("model.model_id"))
    contract_num = db.Column(db.Integer, db.ForeignKey("contract.contract_num"))
    amount = db.Column(db.Integer)
    total_cost = db.Column(db.Integer)
    model = db.relationship(Model, backref=db.backref('sale'), uselist=False)
    
    
class SaleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Sale
        load_instance = True
        sqla_session = db.session
        include_fk = True
        include_relationships = True
    model = fields.Nested(ModelSchema)
