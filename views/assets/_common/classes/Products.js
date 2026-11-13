
export default class Products {
    constructor(id, categoryId, name, price, stock, material, status, photo, storeName, usersId) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.material = material;
        this.status = status;
        this.photo = photo;
        this.storeName = storeName;
        this.usersId = usersId;
    }

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

    getPhoto() {
        return this.photo;
    }

    getStoreName() {
        return this.storeName;
    }

    getUsersId() {
        return this.usersId;
    }

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

    setPhoto(photo) {
        this.photo = photo;
    }

    setStoreName(storeName) {
        this.storeName = storeName;
    }

    setUsersId(usersId) {
        this.usersId = usersId;
    }

    static fromAPI(data) {
        return new Products(
            data.id,
            data.categoryId ?? data.category_id,
            data.name,
            data.price,
            data.stock,
            data.material ?? data.bio,
            data.status ?? data.active,
            data.photo,
            data.storeName,
            data.usersId ?? data.users_id
        );
    }
}
