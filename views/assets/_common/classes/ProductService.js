import HttpClientBase from "./HttpClientBase.js";
import Product from "./Products.js";

export default class ProductService extends HttpClientBase {
    async list() {
        const response = await this.get("/products/list");
        return response.data.map(item => Product.fromAPI(item));
    }

    async find(id) {
        const response = await this.get(`/products/list/${id}`);
        return Product.fromAPI(response.data);
    }

    async create(product) {
        const data = product instanceof Product
            ? product.toJSON()
            : new Product(product).toJSON();

        return this.post("/products/", data);
    }

    async update(id, product) {
        const data = product instanceof Product
            ? product.toJSON()
            : new Product(product).toJSON();

        return this.put(`/products/${id}`, data);
    }

    async remove(id) {
        return this.delete(`/products/${id}`);
    }
}