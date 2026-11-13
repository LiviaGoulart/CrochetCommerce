
import HttpClientBase from "./HttpClientBase.js";

export default class OrderService extends HttpClientBase {

    async create(items) {
        return await this.post("/orders/create", {
            items: items
        });
    }

    async list() {
        return await this.get("/orders/list");
    }

    async updateStatus(id, status) {
    return await this.put(`/orders/status/${id}`, { status: status });
    }

    async listClient() {
    return await this.get("/orders/client");
    }
}
