# database.py
from sqlalchemy.sql.expression import func
from sqlalchemy import asc
from flask import abort, make_response, request, jsonify
from datetime import datetime
from config import db
from models import Furniture, FurnitureSchema, Customer, CustomerSchema, Contract, ContractSchema, Sale, SaleSchema


def read_all_furniture():
    furniture = Furniture.query.order_by(asc(Furniture.furniture_id)).all()
    furniture_schema = FurnitureSchema(many=True)
    return furniture_schema.dump(furniture)


def create_furniture():
    try:
        furniture = request.get_json()
        furniture2 = {
          "furniture_id": db.session.query(func.max(Furniture.furniture_id)).scalar() + 1,
          "name": furniture.get("name"),
          "cost": furniture.get("cost"),
          "color": furniture.get("color"),
          "weight": furniture.get("weight")
        }
        furniture_schema = FurnitureSchema()
        new_furniture = furniture_schema.load(furniture2, session=db.session)
        db.session.add(new_furniture)
        db.session.commit()
        return furniture_schema.dump(new_furniture), 201
    except Exception as e:
        return {'error': str(e)}, 400


def read_one_furniture(furniture_id):
    furniture = Furniture.query.filter(Furniture.furniture_id == furniture_id).one_or_none()

    if furniture is not None:
        furniture_schema = FurnitureSchema()
        return furniture_schema.dump(furniture)
    else:
        abort(404, f"Furniture with id {furniture_id} not found")


def update_furniture():
    try:
        furniture = request.get_json()
        furniture_id = furniture.get("furniture_id")
        existing_furniture = Furniture.query.filter(Furniture.furniture_id == furniture_id).one_or_none()

        if existing_furniture:
            furniture_schema = FurnitureSchema()
            update_furniture = furniture_schema.load(furniture, session=db.session)
            existing_furniture.furniture_id = update_furniture.furniture_id
            existing_furniture.name = update_furniture.name
            existing_furniture.cost = update_furniture.cost
            existing_furniture.color = update_furniture.color
            existing_furniture.weight = update_furniture.weight
            db.session.merge(existing_furniture)
            db.session.commit()
            return furniture_schema.dump(existing_furniture), 201
        else:
            abort(404, f"Furniture with id {furniture_id} not found")
    except Exception as e:
        return {"error": str(e)}, 400


def delete_furniture(furniture_id):
    existing_furniture = Furniture.query.filter(Furniture.furniture_id == furniture_id).one_or_none()

    if existing_furniture:
        db.session.delete(existing_furniture)
        db.session.commit()
        return make_response(f"Furniture with id {furniture_id} successfully deleted", 200)
    else:
        abort(404, f"Furniture with id {furniture_id} not found")


def read_all_customer():
    customers = Customer.query.order_by(asc(Customer.customer_id)).all()
    customers_schema = CustomerSchema(many=True)
    return customers_schema.dump(customers)


def create_customer():
    try:
        customer = request.get_json()
        customer_id = db.session.query(func.max(Customer.customer_id)).scalar() + 1
        contract2 = {
            "customer_id": customer_id,
            "name": customer.get("name"),
            "phone": customer.get("phone"),
            "city": customer.get("city"),
            "street": customer.get("street"),
            "build": customer.get("build")
        }

        customer_schema = CustomerSchema()
        new_contract = customer_schema.load(contract2, session=db.session)
        db.session.add(new_contract)
        db.session.commit()
        return customer_schema.dump(new_contract), 201
    except Exception as e:
        return {"error": str(e)}, 400


def read_one_customer(customer_id):
    customer = Customer.query.filter(Customer.customer_id == customer_id).one_or_none()

    if customer is not None:
        customer_schema = CustomerSchema()
        return customer_schema.dump(customer)
    else:
        abort(404, f"Customer with id {customer_id} not found")


def update_customer():
    try:
        customer = request.get_json()
        customer_id = customer.get("customer_id")
        existing_customer = Customer.query.filter(Customer.customer_id == customer_id).one_or_none()

        if existing_customer:
            contract_schema = CustomerSchema()
            update_customer = contract_schema.load(customer, session=db.session)
            existing_customer.customer_id = update_customer.customer_id
            existing_customer.name = update_customer.name
            existing_customer.phone = update_customer.phone
            existing_customer.city = update_customer.city
            existing_customer.street = update_customer.street
            existing_customer.build = update_customer.build

            db.session.merge(existing_customer)
            db.session.commit()
            return contract_schema.dump(existing_customer), 201
        else:
            abort(404, f"Customer with id {customer_id} not found")
    except Exception as e:
        return {'error': str(e)}, 400


def delete_customer(customer_id):
    existing_customer = Customer.query.filter(Customer.customer_id == customer_id).one_or_none()

    if existing_customer:
        db.session.delete(existing_customer)
        db.session.commit()
        return make_response(f"Customer with id {customer_id} successfully deleted", 200)
    else:
        abort(404, f"Customer with id {customer_id} not found")


def read_all_contract():
    contracts = Contract.query.order_by(asc(Contract.contract_id)).all()
    contracts_schema = ContractSchema(many=True)
    return contracts_schema.dump(contracts)


def create_contract():
    try:
        contract = request.get_json()
        contract2 = {
          "contract_id": db.session.query(func.max(Contract.contract_id)).scalar() + 1,
          "customer_id": contract.get("customer_id"),
          "furniture_id": contract.get("furniture_id"),
          "model_num": contract.get("model_num"),
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


def read_one_contract(contract_id):
    contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

    if contract is not None:
        contract_schema = ContractSchema()
        return contract_schema.dump(contract)
    else:
        abort(404, f"Contract with id {contract_id} not found")


def update_contract():
    try:
        contract = request.get_json()
        contract_id = contract.get("contract_id")
        existing_contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

        if existing_contract:
            contract_schema = ContractSchema()
            update_contract = contract_schema.load(contract, session=db.session)
            existing_contract.contract_id = update_contract.contract_id
            existing_contract.customer_id = update_contract.customer_id
            existing_contract.furniture_id = update_contract.furniture_id
            existing_contract.model_num = update_contract.model_num
            existing_contract.reg_date = update_contract.reg_date
            existing_contract.done_date = update_contract.done_date
            db.session.merge(existing_contract)
            db.session.commit()
            return contract_schema.dump(existing_contract), 201
        else:
            abort(404, f"Contract with id {contract_id} not found")
    except Exception as e:
        return {'error': str(e)}, 400


def delete_contract(contract_id):
    existing_contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

    if existing_contract:
        db.session.delete(existing_contract)
        db.session.commit()
        return make_response(f"Contract with id {contract_id} successfully deleted", 200)
    else:
        abort(404, f"Contract with id {contract_id} not found")


def read_all_sale():
    sales = Sale.query.order_by(asc(Sale.contract_id)).all()
    sales_schema = SaleSchema(many=True)
    return sales_schema.dump(sales)


def create_sale():
    try:
        sale = request.get_json()
        contract_id = sale.get("contract_id")
        existing_contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

        if existing_contract is None:
            abort(404, f"Contract with id {contract_id} not found")

        contract2 = {
          "sale_id": db.session.query(func.max(Sale.sale_id)).scalar() + 1,
          "contract_id": sale.get("contract_id"),
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
        contract_id = sale.get("contract_id")
        existing_sale = Sale.query.filter(Sale.sale_id == sale_id).one_or_none()
        existing_contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

        if existing_contract is None:
            abort(404, f"Contract with id {contract_id} not found")

        if existing_sale:
            contract_schema = SaleSchema()
            update_sale = contract_schema.load(sale, session=db.session)
            existing_sale.sale_id = update_sale.sale_id
            existing_sale.contract_id = update_sale.contract_id
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
