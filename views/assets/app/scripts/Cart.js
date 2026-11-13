
export default class Cart {
    constructor(id = null, products = [], total = 0, cliente = null) {
        this.id = id;
        this.products = products;
        this.total = total;
        this.cliente = cliente;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getProducts() {
        return this.products;
    }

    setProducts(products) {
        this.products = products;
    }

    getTotal() {
        return this.total;
    }

    setTotal(total) {
        this.total = total;
    }

    getCliente() {
        return this.cliente;
    }

    setCliente(cliente) {
        this.cliente = cliente;
    }
}
