import HttpClientBase from "./HttpClientBase";

export default class ProductCategory extends HttpClientBase {

    async list() {
        return this.get("/products-categories/list");
    }

    async listById() {
        return this.get(`/products-categories//list/?{product_id}`);
    }

    async insert() {
        return this.post("/products-categories", data);
    }
}