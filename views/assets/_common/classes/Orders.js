export default class Orders {
    constructor(id, day, status, product, customer, quant, allPrice, payment) {
        this.id = id;
        this.day = day;
        this.status = status;
        this.product = product;
        this.customer = customer;
        this.quant = quant;
        this.allPrice = allPrice;
        this.payment = payment;
    }

    getId() {
        return this.id;
    }

    getDay() {
        return this.day;
    }

    getStatus() {
        return this.status;
    }

    getProduct() {
        return this.product;
    }

    getCustomer() {
        return this.customer;
    }

    getQuant() {
        return this.quant;
    }

    getAllPrice() {
        return this.allPrice;
    }

    getPayment() {
        return this.payment;
    }

    setStatus(status) {
        this.status = status;
    }

    setPayment(payment) {
        this.payment = payment;
    }
}