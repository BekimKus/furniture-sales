
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
        let response = await fetch("/api/customer", options);
        let data = await response.json();
        return data;
    }

    async readOne(customer_code) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/customer/${customer_code}`, options);
        let data = await response.json();
        return data;
    }

    async create(workshop) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(workshop)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/customer`, options);
        let data = await response.json();
        return data;
    }


    async update(customer) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(customer)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/customer`, options);
        let data = await response.json();
        return data;
    }

    async delete(customer_code) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/customer/${customer_code}`, options);
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
        this.table = document.querySelector(".customer table");
        this.error = document.querySelector(".error");
        this.customer_code = document.getElementById("customer_code");
        this.name = document.getElementById("name");
        this.phone = document.getElementById("phone");
        this.city = document.getElementById("city");
        this.street = document.getElementById("street");
        this.build = document.getElementById("build");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.customer_code.textContent = "";
        this.name.value = "";
        this.phone.value = "";
        this.city.value = "";
        this.street.value = "";
        this.build.value = "";
        this.name.focus();
    }

    updateEditor(customer) {
        this.customer_code.textContent = customer.customer_code;
        this.name.value = customer.name;
        this.phone.value = customer.phone;
        this.city.value = customer.city;
        this.street.value = customer.street;
        this.build.value = customer.build;
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
        products.forEach((product) => {
            html += `
            <tr data-customer_code="${product.customer_code}" data-name="${product.name}" 
            data-phone="${product.phone}" data-city="${product.city}" data-street="${product.street}" data-build="${product.build}">
                <td class="customer_code">${product.customer_code}</td>
                <td class="name">${product.name}</td>
                <td class="phone">${product.phone}</td>
                <td class="city">${product.city}</td>
                <td class="street">${product.street}</td>
                <td class="build">${product.build}</td>
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
            let urlproduct_id = +document.getElementById("url_customer_code").value,
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
                customer_code = target.getAttribute("data-customer_code"),
                name = target.getAttribute("data-name"),
                phone = target.getAttribute("data-phone"),
                city = target.getAttribute("data-city"),
                street = target.getAttribute("data-street"),
                build = target.getAttribute("data-build");

            this.view.updateEditor({
                customer_code: customer_code,
                name: name,
                phone: phone,
                city: city,
                street: street,
                build: build
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let name = document.getElementById("name").value,
                phone = document.getElementById("phone").value,
                city = document.getElementById("city").value,
                street = document.getElementById("street").value,
                build = parseInt(document.getElementById("build").value);

            evt.preventDefault();
            try {
                await this.model.create({
                    customer_code: 0,
                    name: name,
                    phone: phone,
                    city: city,
                    street: street,
                    build: build
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let customer_code = +document.getElementById("customer_code").textContent,
                name = document.getElementById("name").value,
                phone = document.getElementById("phone").value,
                street = document.getElementById("street").value,
                city = document.getElementById("city").value,
                build = parseInt(document.getElementById("build").value);

            evt.preventDefault();
            try {
                await this.model.update({
                    customer_code: customer_code,
                    name: name,
                    phone: phone,
                    city: city,
                    street: street,
                    build: build
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let product_id = +document.getElementById("customer_code").textContent;

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
