class Cart{
    constructor() {
        this.id = this.id;
        this.products = this.products;
        this.total = this.total;
        this.cliente = this.cliente;

        this.init();
    }

    init() {
        // this.selectType();
        // this.login();
        // this.submit();

        //colocar os métodos depois
    }


    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
    }

    getProducts(){
        return this.products;
    }
    setProducts(products){
        this.products = products;
    }

    getTotal(){
        return this.total;
    }
    setTotal(total){
        this.total = total;
    }

    getCliente(){
        return this.cliente;
    }
    setCliente(cliente){
        this.cliente = cliente;
    }
}