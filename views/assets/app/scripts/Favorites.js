class Favorites extends Products{
    constructor() {
        this.quant = this.quant;
        this.liked = this.liked;//true or false

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

    getLiked() {
        return this.liked;
    }
    setLiked(liked) {
        this.liked = liked;
    }
}