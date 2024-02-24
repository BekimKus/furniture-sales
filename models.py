# models.py

from config import db, ma
from marshmallow_sqlalchemy import fields


class Furniture(db.Model):
    __tablename__ = "furniture"
    furniture_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    cost = db.Column(db.Integer)
    color = db.Column(db.String)
    weight = db.Column(db.Integer)


class FurnitureSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Furniture
        load_instance = True
        sqla_session = db.session
        include_fk = True


class Customer(db.Model):
    __tablename__ = "customer"
    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
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
    contract_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customer.customer_id"))
    furniture_id = db.Column(db.Integer, db.ForeignKey("furniture.furniture_id"))
    model_num = db.Column(db.Integer)
    reg_date = db.Column(db.String)
    done_date = db.Column(db.String)
    customer = db.relationship(Customer, backref=db.backref('customer'), uselist=False)
    furniture = db.relationship(Furniture, backref=db.backref('furniture'), uselist=False)


class ContractSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Contract
        load_instance = True
        sqla_session = db.session
        include_fk = True
    customer = fields.Nested(CustomerSchema)
    furniture = fields.Nested(FurnitureSchema)


class Sale(db.Model):
    __tablename__ = "sale"
    sale_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    contract_id = db.Column(db.Integer, db.ForeignKey("contract.contract_id"))
    amount = db.Column(db.Integer)
    total_cost = db.Column(db.Integer)
    contract = db.relationship(Contract, backref=db.backref('contract'), uselist=False)


class SaleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Sale
        load_instance = True
        sqla_session = db.session
        include_fk = True
    contract = fields.Nested(ContractSchema)

