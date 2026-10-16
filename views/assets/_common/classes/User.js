
export default class User {
    #id;
    #name;
    #email;

    constructor({ id = null, name = "", email = "" } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    get id() { return this.#id; }
    set id(value) {
        this.#id = value == null ? null : Number(value);
    }

    get name() { return this.#name; }
    set name(value) {
        if (typeof value !== "string" || !value.trim()) {
            throw new TypeError("O nome é obrigatório");
        }
        this.#name = value.trim();
    }

    get email() { return this.#email; }
    set email(value) {
        if (typeof value !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new TypeError("E-mail inválido");
        }
        this.#email = value.trim();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        };
    }

    static fromAPI(data) {
        return new User(data);
    }
}