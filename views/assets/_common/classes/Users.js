import HttpClientBase from "./HttpClientBase.js";

export default class Users extends HttpClientBase {

    async loginCrochet(email, password) {
    return this.post("/users/login", { email, password });
    }

    async login(email, password) {
        return this.post("/users/login-client", { email, password });
    }

    async register(data) {
        return this.post("/users/register", data);
    }

    async registerClient(data) {
        return this.post("/users/register-client", data);
    }

    async update(data) {
        return this.put("/users/update", data);
    }

    async updateClient(data) {
        return this.put("/users/update-client", data);
    }

    async deleteCrochet() {
    return this.delete("/users/delete");
    }

    async deleteClient() {
    return this.delete("/users/delete-client");
    }


    async loginGeral(email, password) {
    return this.post("/users/login", { email, password });
    }

}