# database.py
from marshmallow import EXCLUDE
from sqlalchemy.sql.expression import func
from sqlalchemy import asc
from flask import abort, make_response, request
from datetime import datetime
from config import db
from models import Model, ModelSchema, Contract, ContractSchema, Sale, SaleSchema, Customer, CustomerSchema


def login():
    pass


def read_all_model():
    model = Model.query.order_by(asc(Model.model_id)).all()
    model_schema = ModelSchema(many=True)
    return model_schema.dump(model)


def create_model():
    try:
        model = request.get_json()
        model2 = {
          "name": model.get("name"),
          "model": model.get("model"),
          "color": model.get("color"),
          "model_id": db.session.query(func.max(Model.model_id)).scalar() + 1,
          "cost": model.get("cost"),
          "weight": model.get("weight")
        }
        model_schema = ModelSchema()
        new_model = model_schema.load(model2, session=db.session)
        db.session.add(new_model)
        db.session.commit()
        return model_schema.dump(new_model), 201
    except Exception as e:
        return {'error': str(e)}, 400


def read_one_model(model_id):
    model = Model.query.filter(Model.model_id == model_id).one_or_none()

    if model is not None:
        model_schema = ModelSchema()
        return model_schema.dump(model)
    else:
        abort(404, f"Model with id {model_id} not found")


def update_model():
    try:
        model = request.get_json()
        model_id = model.get("model_id")
        existing_model = Model.query.filter(Model.model_id == model_id).one_or_none()

        if existing_model:
            model_schema = ModelSchema()
            update_model = model_schema.load(model, session=db.session)
            existing_model.model_id = update_model.model_id
            existing_model.name = update_model.name
            existing_model.cost = update_model.cost
            existing_model.color = update_model.color
            existing_model.model = update_model.model
            existing_model.weight = update_model.weight
            db.session.merge(existing_model)
            db.session.commit()
            return model_schema.dump(existing_model), 201
        else:
            abort(404, f"Model with id {model_id} not found")
    except Exception as e:
        return {"error": str(e)}, 400


def delete_model(model_id):
    existing_model = Model.query.filter(Model.model_id == model_id).one_or_none()

    if existing_model:
        db.session.delete(existing_model)
        db.session.commit()
        return make_response(f"Model with id {model_id} successfully deleted", 200)
    else:
        abort(404, f"Model with id {model_id} not found")


def read_all_customer():
    contracts = Customer.query.order_by(asc(Customer.customer_code)).all()
    contracts_schema = CustomerSchema(many=True)
    return contracts_schema.dump(contracts)


def create_customer():
    try:
        customer = request.get_json()
        code = db.session.query(func.max(Customer.customer_code)).scalar() + 1
        contract2 = {
            "name": customer.get("name"),
            "customer_code": code,
            "phone": customer.get("phone"),
            "city": customer.get("city"),
            "street": customer.get("street"),
            "build": customer.get("build")
        }

        contract_schema = CustomerSchema()
        new_contract = contract_schema.load(contract2, session=db.session)
        db.session.add(new_contract)
        db.session.commit()
        return contract_schema.dump(new_contract), 201
    except Exception as e:
        return {"error": str(e)}, 400


def read_one_customer(contract_id):
    contract = Customer.query.filter(Customer.customer_code == contract_id).one_or_none()

    if contract is not None:
        contract_schema = CustomerSchema()
        return contract_schema.dump(contract)
    else:
        abort(404, f"Customer with id {contract_id} not found")


def update_customer():
    try:
        customer = request.get_json()
        customer_code = customer.get("customer_code")
        existing_contract = Customer.query.filter(Customer.customer_code == customer_code).one_or_none()

        if existing_contract:
            contract_schema = CustomerSchema()
            update_contract = contract_schema.load(customer, session=db.session)
            existing_contract.customer_code = update_contract.customer_code
            existing_contract.name = update_contract.name
            existing_contract.phone = update_contract.phone
            existing_contract.city = update_contract.city
            existing_contract.street = update_contract.street
            existing_contract.build = update_contract.build

            db.session.merge(existing_contract)
            db.session.commit()
            return contract_schema.dump(existing_contract), 201
        else:
            abort(404, f"Customer with id {customer_code} not found")
    except Exception as e:
        return {'error': str(e)}, 400


def delete_customer(customer_code):
    existing_contract = Customer.query.filter(Customer.customer_code == customer_code).one_or_none()

    if existing_contract:
        db.session.delete(existing_contract)
        db.session.commit()
        return make_response(f"Customer with id {customer_code} successfully deleted", 200)
    else:
        abort(404, f"Customer with id {customer_code} not found")


def read_all_contract():
    contracts = Contract.query.order_by(asc(Contract.contract_num)).all()
    contracts_schema = ContractSchema(many=True)
    return contracts_schema.dump(contracts)


def create_contract():
    try:
        contract = request.get_json()
        contract2 = {
          "contract_num": db.session.query(func.max(Contract.contract_num)).scalar() + 1,
          "customer_code": contract.get("customer_code"),
          "reg_date": contract.get("reg_date"),
          "done_date": contract.get("done_date")
        }
        contract_schema = ContractSchema()
        new_contract = contract_schema.load(contract2, session=db.session)
        db.session.add(new_contract)
        db.session.commit()
        return contract_schema.dump(new_contract), 201
    except Exception as e:
        return {'error': str(e)}, 400


def read_one_contract(contract_num):
    contract = Contract.query.filter(Contract.contract_num == contract_num).one_or_none()

    if contract is not None:
        contract_schema = ContractSchema()
        return contract_schema.dump(contract)
    else:
        abort(404, f"Contract with id {contract_num} not found")


def update_contract():
    try:
        contract = request.get_json()
        contract_num = contract.get("contract_num")
        existing_contract = Contract.query.filter(Contract.contract_num == contract_num).one_or_none()

        if existing_contract:
            contract_schema = ContractSchema()
            update_contract = contract_schema.load(contract, session=db.session)
            existing_contract.contract_num = update_contract.contract_num
            existing_contract.customer_code = update_contract.customer_code
            existing_contract.reg_date = update_contract.reg_date
            existing_contract.done_date = update_contract.done_date
            db.session.merge(existing_contract)
            db.session.commit()
            return contract_schema.dump(existing_contract), 201
        else:
            abort(404, f"Contract with id {contract_num} not found")
    except Exception as e:
        return {'error': str(e)}, 400


def delete_contract(contract_num):
    existing_contract = Contract.query.filter(Contract.contract_num == contract_num).one_or_none()

    if existing_contract:
        db.session.delete(existing_contract)
        db.session.commit()
        return make_response(f"Contract with id {contract_num} successfully deleted", 200)
    else:
        abort(404, f"Contract with id {contract_num} not found")


def read_all_sale():
    contracts = Sale.query.order_by(asc(Sale.contract_num)).all()
    contracts_schema = SaleSchema(many=True)
    return contracts_schema.dump(contracts)


def create_sale():
    try:
        sale = request.get_json()
        model_id = sale.get("model_id")
        contract_num = sale.get("contract_num")
        existing_model = Model.query.filter(Model.model_id == model_id).one_or_none()
        existing_contract = Contract.query.filter(Contract.contract_num == contract_num).one_or_none()

        if existing_contract is None:
            abort(404, f"Contract with id {contract_num} not found")

        if existing_model is None:
            abort(404, f"Model with id {model_id} not found")

        contract2 = {
          "sale_id": db.session.query(func.max(Sale.sale_id)).scalar() + 1,
          "contract_num": sale.get("contract_num"),
          "model_id": sale.get("model_id"),
          "amount": sale.get("amount"),
          "total_cost": sale.get("total_cost")
        }
        contract_schema = SaleSchema()
        new_contract = contract_schema.load(contract2, session=db.session)
        db.session.add(new_contract)
        db.session.commit()
        return contract_schema.dump(new_contract), 201
    except Exception as e:
        return {'error': str(e)}, 400


def read_one_sale(sale_id):
    contract = Sale.query.filter(Sale.sale_id == sale_id).one_or_none()

    if contract is not None:
        contract_schema = SaleSchema()
        return contract_schema.dump(contract)
    else:
        abort(
            404, f"Sale with id {sale_id} not found"
        )


def update_sale():
    try:
        sale = request.get_json()
        sale_id = sale.get("sale_id")
        model_id = sale.get("model_id")
        contract_num = sale.get("contract_num")
        existing_sale = Sale.query.filter(Sale.sale_id == sale_id).one_or_none()
        existing_model = Model.query.filter(Model.model_id == model_id).one_or_none()
        existing_contract = Contract.query.filter(Contract.contract_num == contract_num).one_or_none()

        if existing_contract is None:
            abort(404, f"Contract with id {contract_num} not found")

        if existing_model is None:
            abort(404, f"Model with id {model_id} not found")

        if existing_sale:
            contract_schema = SaleSchema()
            update_sale = contract_schema.load(sale, session=db.session)
            existing_sale.sale_id = update_sale.sale_id
            existing_sale.contract_num = update_sale.contract_num
            existing_sale.model_id = update_sale.model_id
            existing_sale.amount = update_sale.amount
            existing_sale.total_cost = update_sale.total_cost
            db.session.merge(existing_sale)
            db.session.commit()
            return contract_schema.dump(existing_contract), 201
        else:
            abort(404, f"Sale with id {sale_id} not found")
    except Exception as e:
        return {'error': str(e)}, 400


def delete_sale(sale_id):
    existing_contract = Sale.query.filter(Sale.sale_id == sale_id).one_or_none()

    if existing_contract:
        db.session.delete(existing_contract)
        db.session.commit()
        return make_response(f"Sale with id {sale_id} successfully deleted", 200)
    else:
        abort(404, f"Sale with id {sale_id} not found")
