
export default class ProductCategory {
    #id;
    #name;

    constructor({ id = null, name = "" } = {}) {
        this.id = id;
        this.name = name;
    }

    get id() { return this.#id; }
    set id(value) {
        this.#id = value == null ? null : Number(value);
    }

    get name() { return this.#name; }
    set name(value) {
        if (typeof value !== "string" || !value.trim()) {
            throw new TypeError("O nome da categoria é obrigatório");
        }
        this.#name = value.trim();
    }

    toJSON() {
        return { id: this.id, name: this.name };
    }

    static fromAPI(data) {
        return new ProductCategory(data);
    }
}