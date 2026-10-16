class Products {
    constructor(id, categoryId, name, price, stock, material, status) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.material = material;
        this.status = status;

        this.init();
    }

    init() {
        // colocar os métodos depois
    }

    // Getters
    getId() {
        return this.id;
    }

    getCategoryId() {
        return this.categoryId;
    }

    getName() {
        return this.name;
    }

    getPrice() {
        return this.price;
    }

    getStock() {
        return this.stock;
    }

    getMaterial() {
        return this.material;
    }

    getStatus() {
        return this.status;
    }

    // Setters
    setId(id) {
        this.id = id;
    }

    setCategoryId(categoryId) {
        this.categoryId = categoryId;
    }

    setName(name) {
        this.name = name;
    }

    setPrice(price) {
        this.price = price;
    }

    setStock(stock) {
        this.stock = stock;
    }

    setMaterial(material) {
        this.material = material;
    }

    setStatus(status) {
        this.status = status;
    }
}

