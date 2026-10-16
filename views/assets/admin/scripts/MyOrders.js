class MyOrders {
    constructor() {
        this.name = this.name;
        this.price = this.price;
        this.stock = this.stock;
        this.sales = this.sales;
        this.status = this.status; //ativo ou inativo
        
        this.init();
    }

    init() {
        // this.selectType();
        // this.login();
        // this.submit();

        //colocar os métodos depois
    }

    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }

    getPrice() {
        return this.price;
    }
    setPrice(price) {
        this.price = price;
    }

    getStock() {
        return this.stock;
    }
    setStock(stock) {
        this.stock = stock;
    }

    getSales() {
        return this.sales;
    }
    setSales(sales) {
        this.sales = sales;
    }

    getStatus() {
        return this.status;
    }
    setStatus(status) {
        this.status = status;
    }
}