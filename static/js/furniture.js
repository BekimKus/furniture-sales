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
        let response = await fetch("/api/furniture", options);
        let data = await response.json();
        return data;
    }

    async readOne(product_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/furniture/${product_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(furniture) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(furniture)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/furniture`, options);
        let data = await response.json();
        return data;
    }

    async update(product) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(product)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/furniture`, options);
        let data = await response.json();
        return data;
    }

    async delete(product_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/furniture/${product_id}`, options);
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
        this.table = document.querySelector(".furniture table");
        this.error = document.querySelector(".error");
        this.furniture_id= document.getElementById("furniture_id");
        this.name = document.getElementById("name");
        this.cost = document.getElementById("cost");
        this.color = document.getElementById("color");
        this.weight = document.getElementById("weight");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.furniture_id.textContent = "";
        this.name.value = "";
        this.cost.value = "";
        this.color.value = "";
        this.weight.value = "";
        this.name.focus();
    }

    updateEditor(product) {
        this.furniture_id.textContent = product.furniture_id;
        this.name.value = product.name;
        this.cost.value = product.cost;
        this.color.value = product.color;
        this.weight.value = product.weight;
        this.name.focus();
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

    buildTable(products) {
        let tbody,
            html = "";

        // Iterate over the products and build the table
        for (let i=0; i<products.length; i++) {
            html += `
            <tr data-furniture_id="${products[i].furniture_id}" data-num="${products[i].furniture_id}" data-name="${products[i].name}" data-cost="${products[i].cost}"
            data-color="${products[i].color}" data-weight="${products[i].weight}" >
                <td class="furniture_id">${products[i].furniture_id}</td>
                <td class="name">${products[i].name}</td>
                <td class="cost">${products[i].cost}</td>
                <td class="color">${products[i].color}</td>
                <td class="weight">${products[i].weight}</td>
            </tr>`;
        }
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
            let urlproduct_id = +document.getElementById("url_furniture_id").value,
                products = await this.model.read();

            this.view.buildTable(products);

            // Did we navigate here with a product selected?
            if (urlproduct_id) {
                let product = await this.model.readOne(urlproduct_id);
                this.view.updateEditor(product);
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
                num = target.getAttribute("data-num"),
                furniture_id = target.getAttribute("data-furniture_id"),
                name = target.getAttribute("data-name"),
                cost = target.getAttribute("data-cost"),
                color = target.getAttribute("data-color"),
                weight = target.getAttribute("data-weight");

            this.view.updateEditor({
                furniture_id: furniture_id,
                name: name,
                cost: cost,
                color: color,
                weight: weight
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let name = document.getElementById("name").value,
                color = document.getElementById("color").value,
                cost = parseInt(document.getElementById("cost").value),
                weight = parseInt(document.getElementById("weight").value);
            //furniture_id = Math.floor(Math.random()*1000000);
            evt.preventDefault();
            try {
                await this.model.create({
                    furniture_id: 0,
                    name: name,
                    color: color,
                    weight: weight,
                    cost: cost
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let furniture_id = +document.getElementById("furniture_id").textContent,
                name = document.getElementById("name").value,
                cost = parseInt(document.getElementById("cost").value),
                color = document.getElementById("color").value,
                weight = parseInt(document.getElementById("weight").value);

            evt.preventDefault();
            try {
                await this.model.update({
                    furniture_id: furniture_id,
                    name: name,
                    cost: cost,
                    color: color,
                    weight: weight
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let product_id = +document.getElementById("furniture_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(product_id);
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
