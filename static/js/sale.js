/**
 * This is the model class which provides access to the server REST API
 * @type {{}}
 */
class Model {
    async read() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/sale", options);
        let data = await response.json();
        return data;
    }

    async readOne(sale_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/sale/${sale_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(sale) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(sale)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/sale`, options);
        let data = await response.json();
        return data;
    }

    async update(sale) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(sale)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/sale`, options);
        let data = await response.json();
        return data;
    }

    async delete(sale_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/sale/${sale_id}`, options);
        return response;
    }
}


/**
 * This is the view class which provides access to the DOM
 */
class View {
    constructor() {
        this.NEW_NOTE = 0;
        this.EXISTING_NOTE = 1;
        this.table = document.querySelector(".sale table");
        this.error = document.querySelector(".error");
        this.sale_id = document.getElementById("sale_id");
        this.contract_id = document.getElementById("contract_id");
        this.amount = document.getElementById("amount");
        this.total_cost = document.getElementById("total_cost");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.sale_id.textContent = null;
        this.contract_id.value = null;
        this.amount.value = null;
        this.total_cost.value = null;
        this.total_cost.focus();
    }

    updateEditor(order) {
        this.sale_id.textContent = order.sale_id;
        this.contract_id.value = order.contract_id;
        this.amount.value = order.amount;
        this.total_cost.value = order.total_cost;
        this.total_cost.focus();
    }

    setButtonState(state) {
        if (state === this.NEW_NOTE) {
            this.createButton.disabled = false;
            this.updateButton.disabled = true;
            this.deleteButton.disabled = true;
        } else if (state === this.EXISTING_NOTE) {
            this.createButton.disabled = true;
            this.updateButton.disabled = false;
            this.deleteButton.disabled = false;
        }
    }


    buildTable(sale) {
        let tbody,
            html = "";

        // Iterate over the orders and build the table
        sale.forEach((order) => {
            html += `
            <tr data-sale_id="${order.sale_id}" data-contract_id="${order.contract_id}" data-amount="${order.amount}"
            data-total_cost="${order.total_cost}">
                <td class="contract_id">${order.contract_id}</td>
                <td class="amount">${order.amount}</td>
                <td class="total_cost">${order.total_cost}</td>
            </tr>`;
        });
        // Is there currently a tbody in the table?
        if (this.table.tBodies.length !== 0) {
            this.table.removeChild(this.table.getElementsByTagName("tbody")[0]);
        }
        // Update tbody with our new content
        tbody = this.table.createTBody();
        tbody.innerHTML = html;
    }

    errorMessage(message) {
        this.error.innerHTML = message;
        this.error.classList.add("visible");
        this.error.classList.remove("hidden");
        setTimeout(() => {
            this.error.classList.add("hidden");
            this.error.classList.remove("visible");
        }, 2000);
    }
}


/**
 * This is the controller class for the user interaction
 */
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.initialize();
    }

    async initialize() {
        await this.initializeTable();
        this.initializeTableEvents();
        this.initializeCreateEvent();
        this.initializeUpdateEvent();
        this.initializeDeleteEvent();
        this.initializeResetEvent();
    }

    async initializeTable() {
        try {
            let urlorder_id = +document.getElementById("url_sale_id").value,
                sale = await this.model.read();
                
            this.view.buildTable(sale);
    
            // Did we navigate here with a order selected?
            if (urlorder_id) {
                let order = await this.model.readOne(urlorder_id);
                this.view.updateEditor(order);
                this.view.setButtonState(this.view.EXISTING_NOTE);

            // Otherwise, nope, so leave the editor blank
            } else {
                this.view.reset();
                this.view.setButtonState(this.view.NEW_NOTE);
            }
            this.initializeTableEvents();
        } catch (err) {
            this.view.errorMessage(err);
        }
    }

    initializeTableEvents() {
        document.querySelector("table tbody").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                sale_id = target.getAttribute("data-sale_id"),
                contract_id = target.getAttribute("data-contract_id"),
                amount = target.getAttribute("data-amount"),
                total_cost = target.getAttribute("data-total_cost");

            this.view.updateEditor({
                sale_id: sale_id,
                contract_id: contract_id,
                amount: amount,
                total_cost: total_cost
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
        
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let contract_id = parseInt(document.getElementById("contract_id").value),
                amount = parseInt(document.getElementById("amount").value),
                total_cost = parseInt(document.getElementById("total_cost").value);

            evt.preventDefault();
            try {
                await this.model.create({
                    sale_id: 0,
                    contract_id: contract_id,
                    amount: amount,
                    total_cost: total_cost
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let sale_id = +document.getElementById("sale_id").textContent,
                contract_id = parseInt(document.getElementById("contract_id").value),
                amount = parseInt(document.getElementById("amount").value),
                total_cost = parseInt(document.getElementById("total_cost").value);

            evt.preventDefault();
            try {
                await this.model.update({
                    sale_id: sale_id,
                    contract_id: contract_id,
                    amount: amount,
                    total_cost: total_cost
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let order_id = +document.getElementById("sale_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(order_id);
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeResetEvent() {
        document.getElementById("reset").addEventListener("click", async (evt) => {
            evt.preventDefault();
            this.view.reset();
            this.view.setButtonState(this.view.NEW_NOTE);
        });
    }
}

// Create the MVC components
const model = new Model();
const view = new View();
const controller = new Controller(model, view);

// export the MVC components as the default
export default {
    model,
    view,
    controller
};
