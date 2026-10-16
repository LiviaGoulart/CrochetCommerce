
export default class Products {
    #id;
    #usersId;
    #categoryId;
    #name;
    #price;
    #active;

    constructor({
        id = null,
        usersId = null,
        categoryId = null,
        name = "",
        price = 0,
        active = 1
    } = {}) {
        this.id = id;
        this.usersId = usersId;
        this.categoryId = categoryId;
        this.name = name;
        this.price = price;
        this.active = active;
    }

    get id() { return this.#id; }
    set id(value) {
        this.#id = value == null ? null : Number(value);
        if (this.#id !== null && !Number.isInteger(this.#id)) {
            throw new TypeError("ID inválido");
        }
    }

    get usersId() { return this.#usersId; }
    set usersId(value) {
        this.#usersId = value == null ? null : Number(value);
    }

    get categoryId() { return this.#categoryId; }
    set categoryId(value) {
        const number = Number(value);
        if (!Number.isInteger(number) || number <= 0) {
            throw new RangeError("Categoria inválida");
        }
        this.#categoryId = number;
    }

    get name() { return this.#name; }
    set name(value) {
        if (typeof value !== "string" || !value.trim()) {
            throw new TypeError("O nome é obrigatório");
        }
        this.#name = value.trim();
    }

    get price() { return this.#price; }
    set price(value) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) {
            throw new RangeError("Preço inválido");
        }
        this.#price = number;
    }

    get active() { return this.#active; }
    set active(value) {
        if (![0, 1, "0", "1", true, false].includes(value)) {
            throw new TypeError("Estado do produto inválido");
        }
        this.#active = value === true || value === "1" ? 1
            : value === false || value === "0" ? 0 : value;
    }

    toJSON() {
        return {
            id: this.id,
            usersId: this.usersId,
            categoryId: this.categoryId,
            name: this.name,
            price: this.price,
            active: this.active
        };
    }

    static fromAPI(data) {
        return new Products({
            id: data.id,
            usersId: data.usersId ?? data.users_id,
            categoryId: data.categoryId ?? data.category_id,
            name: data.name,
            price: data.price,
            active: data.active
        });
    }
}