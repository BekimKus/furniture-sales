# app.py
from flask import render_template
import config

app = config.connex_app
app.add_api(config.basedir / "swagger.yml")


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/model")
@app.route("/model/<int:model_id>")
def model(model_id=""):
    return render_template("model.html", model_id=model_id)


@app.route("/customer")
@app.route("/customer/<int:customer_id>")
def customer(customer_id=""):
    return render_template("customer.html", customer_id=customer_id)


@app.route("/contract")
@app.route("/contract/<int:contract_id>")
def contract(contract_num=""):
    return render_template("contract.html", contract_num=contract_num)


@app.route("/sale")
@app.route("/sale/<int:sale_id>")
def sale(sale_id=""):
    return render_template("sale.html", sale_id=sale_id)


if __name__ == "__main__":
    app.run(host="localhost", port=8000)
    # app.run(host="0.0.0.0", port=8000, debug=True)
