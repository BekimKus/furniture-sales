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
        let response = await fetch("/api/contract", options);
        let data = await response.json();
        return data;
    }

    async readOne(contract_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/contract/${contract_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(contract) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(contract)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/contract`, options);
        let data = await response.json();
        return data;
    }

    async update(contract) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(contract)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/contract`, options);
        let data = await response.json();
        return data;
    }

    async delete(contract_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/contract/${contract_id}`, options);
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
        this.table = document.querySelector(".contract table");
        this.error = document.querySelector(".error");
        this.contract_id = document.getElementById("contract_id");
        this.customer_id = document.getElementById("customer_id");
        this.furniture_id = document.getElementById("furniture_id");
        this.model_num = document.getElementById("model_num");
        this.reg_date = document.getElementById("reg_date");
        this.reg_date_time = document.getElementById("reg_date_time");
        this.done_date = document.getElementById("done_date");
        this.done_date_time = document.getElementById("done_date_time");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.contract_id.textContent = "";
        this.customer_id.value = "";
        this.furniture_id.value = "";
        this.model_num.value = "";
        this.reg_date.value = "";
        this.reg_date_time.value = "";
        this.done_date.value = "";
        this.done_date_time.value = "";
        this.customer_id.focus();
    }

    updateEditor(contract) {
        this.contract_id.textContent = contract.contract_id;
        this.customer_id.value = contract.customer_id;
        this.furniture_id.value = contract.furniture_id;
        this.model_num.value = contract.model_num;
        this.reg_date.value = contract.reg_date.split(' ')[0];
        this.reg_date_time.value = contract.reg_date.split(' ')[1];
        this.done_date.value = contract.done_date.split(' ')[0];
        this.done_date_time.value = contract.done_date.split(' ')[1];
        this.customer_id.focus();
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

    buildTable(contracts) {
        let tbody,
            html = "";

        // Iterate over the contracts and build the table
        contracts.forEach((contract) => {
            html += `
            <tr data-contract_id="${contract.contract_id}" data-customer_id="${contract.customer_id}" data-reg_date="${contract.reg_date}"
            data-done_date="${contract.done_date}" data-furniture_id="${contract.furniture_id}" data-model_num="${contract.model_num}">
                <td class="contract_id">${contract.contract_id}</td>
                <td class="customer_id">${contract.customer_id}</td>
                <td class="furniture_id">${contract.furniture_id}</td>
                <td class="model_num">${contract.model_num}</td>
                <td class="reg_date">${contract.reg_date}</td>
                <td class="done_date">${contract.done_date}</td>
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
            let urlcontract_id = +document.getElementById("url_contract_id").value,
                contracts = await this.model.read();

            this.view.buildTable(contracts);

            // Did we navigate here with a contract selected?
            if (urlcontract_id) {
                let contract = await this.model.readOne(urlcontract_id);
                this.view.updateEditor(contract);
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
                contract_id = target.getAttribute("data-contract_id"),
                customer_id = target.getAttribute("data-customer_id"),
                furniture_id = target.getAttribute("data-furniture_id"),
                model_num = target.getAttribute("data-model_num"),
                reg_date = target.getAttribute("data-reg_date") + ' ' + target.getAttribute("data-reg_date_time"),
                done_date = target.getAttribute("data-done_date") + ' ' + target.getAttribute("data-done_date_time");

            this.view.updateEditor({
                contract_id: contract_id,
                customer_id: customer_id,
                furniture_id: furniture_id,
                model_num: model_num,
                reg_date: reg_date,
                done_date: done_date
             
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let customer_id = parseInt(document.getElementById("customer_id").value),
                furniture_id = parseInt(document.getElementById("furniture_id").value),
                model_num = parseInt(document.getElementById("model_num").value),
                reg_date = document.getElementById("reg_date").value + ' ' + document.getElementById("reg_date_time").value,
                done_date = document.getElementById("done_date").value + ' ' + document.getElementById("done_date_time").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    contract_id: 0,
                    customer_id: customer_id,
                    furniture_id: furniture_id,
                    model_num: model_num,
                    reg_date: reg_date,
                    done_date: done_date
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let contract_id = +document.getElementById("contract_id").textContent,
                customer_id = parseInt(document.getElementById("customer_id").value),
                furniture_id = parseInt(document.getElementById("furniture_id").value),
                model_num = parseInt(document.getElementById("model_num").value),
                reg_date = document.getElementById("reg_date").value + ' ' + document.getElementById("reg_date_time").value,
                done_date = document.getElementById("done_date").value + ' ' + document.getElementById("done_date_time").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    contract_id: contract_id,
                    customer_id: customer_id,
                    furniture_id: furniture_id,
                    model_num: model_num,
                    reg_date: reg_date,
                    done_date: done_date
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let contract_id = +document.getElementById("contract_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(contract_id);
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
