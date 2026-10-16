class Orders extends Products{
    constructor() {
        this.quant = this.quant;
        this.day = this.day;
        this.allPrice = this.allPrice;
        this.payment = this.payment;

        this.init();
    }

     init() {
        // this.selectType();
        // this.login();
        // this.submit();

        //colocar os métodos depois
    }

    getQuant() {
        return this.quant;
    }
    setId(quant) {
        this.quant = quant;
    }


    getDay() {
        return this.day;
    }
    setDay(day) {
        this.day = day;
    }


    getAllPrice() {
        return this.allPrice;
    }
    setAllPrice(allPrice) {
        this.allPrice = allPrice;
    }


    getPayment(){
        return this.payment;
    }
    setPayment(payment){
        this;payment = payment;
    }
}