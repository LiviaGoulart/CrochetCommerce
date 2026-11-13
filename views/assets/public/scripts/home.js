
import FaqService from "../../_common/classes/FaqService.js";
import ProductService from "../../_common/classes/ProductService.js";
import OrderService from "../../_common/classes/OrderService.js";

const faqService = new FaqService();
const productService = new ProductService();
const orderService = new OrderService();

let products = [];
let cart = [];

// Usuário logado
function getUser() {
    return JSON.parse(localStorage.getItem("user") || "null");
}

// Caminho das imagens
function getImageUrl(photo, defaultImage) {
    if (!photo) return defaultImage;

    if (photo.startsWith("http")) return photo;

    return "http://localhost/crochet/" + photo.replace(/^\/+/, "");
}

// Foto de perfil
function loadProfilePhoto() {
    const user = getUser();
    const headerPhoto = document.querySelector("#header-profile-photo");

    if (headerPhoto) {
        headerPhoto.src = getImageUrl(
            user?.photo,
            "assets/images/default-profile.svg"
        );
    }
}

loadProfilePhoto();

// Elementos da página
const searchInput = document.querySelector("#search-input");
const sortProducts = document.querySelector("#sort-products");
const productsGrid = document.querySelector(".products-grid");
const productsCount = document.querySelector(".products-header p");

const categoryFilters = document.querySelectorAll(
    '.filter-group:first-of-type input[type="checkbox"]'
);

const priceFilters = document.querySelectorAll(
    '.filter-group:nth-of-type(2) input[type="radio"]'
);

const clearFiltersButton = document.querySelector(".limparFiltros");

// Elementos do carrinho
const cartButton = document.querySelector("#cart-button");
const cartCount = document.querySelector("#cart-count");
const cartPanel = document.querySelector("#cart-panel");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const closeCartButton = document.querySelector("#close-cart");
const checkoutButton = document.querySelector("#checkout-button");


cartButton.addEventListener("click", () => {
    cartPanel.hidden = false;
    renderCart();
}); 


// Categorias
const categoryMap = {
    "Amigurumi": [7],
    "Roupas": [1, 2, 3, 4, 5],
    "Acessórios": [6],
    "Decoração": [],
    "Bebê": [2],
    "Pet": []
};

// Formatar preço
function formatPrice(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Carregar produtos
async function loadProducts() {
    try {
        products = await productService.listStore();

        products = products.filter(product =>
            Number(product.active ?? product.status) === 1
        );

        filterProducts();

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        productsGrid.textContent = "Não foi possível carregar os produtos.";
        productsCount.textContent = "0 produtos encontrados";
    }
}

// Adicionar produto ao carrinho
function addToCart(product) {
    const existingItem = cart.find(item =>
        Number(item.product.id) === Number(product.id)
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }

    renderCart();

    alert("Produto adicionado ao carrinho!");
}

// Atualizar carrinho
function renderCart() {
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;
    let quantityTotal = 0;

    cart.forEach(item => {
        const product = item.product;
        const subtotal = Number(product.price) * item.quantity;

        total += subtotal;
        quantityTotal += item.quantity;

        const article = document.createElement("article");
        article.className = "cart-item";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(product.price);

        const quantity = document.createElement("p");
        quantity.textContent = "Quantidade: " + item.quantity;

        const subtotalText = document.createElement("p");
        subtotalText.textContent = "Subtotal: " + formatPrice(subtotal);

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "-";

        decreaseButton.addEventListener("click", () => {
            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem !== item);
            }

            renderCart();
        });

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";

        increaseButton.addEventListener("click", () => {
            item.quantity++;
            renderCart();
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remover";

        removeButton.addEventListener("click", () => {
            cart = cart.filter(cartItem => cartItem !== item);
            renderCart();
        });

        article.append(
            name,
            price,
            quantity,
            subtotalText,
            decreaseButton,
            increaseButton,
            removeButton
        );

        cartItems.append(article);
    });

    cartTotal.textContent = formatPrice(total);

    if (cartCount) {
        cartCount.textContent = quantityTotal;
    }

    if (cart.length === 0) {
        cartItems.textContent = "Seu carrinho está vazio.";
    }
}

// Abrir carrinho
if (cartButton && cartPanel) {
    cartButton.addEventListener("click", () => {
        cartPanel.hidden = false;
        renderCart();
    });
}

// Fechar carrinho
if (closeCartButton && cartPanel) {
    closeCartButton.addEventListener("click", () => {
        cartPanel.hidden = true;
    });
}

// Finalizar pedido
if (checkoutButton) {
    checkoutButton.addEventListener("click", async () => {
        const user = getUser();

        if (!user || !user.token) {
            alert("Faça login como cliente para finalizar o pedido.");
            window.location.href = "login.html";
            return;
        }

        if (Number(user.typeId) !== 1) {
            alert("Somente clientes podem realizar pedidos.");
            return;
        }

        if (cart.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        const items = cart.map(item => ({
            product_id: Number(item.product.id),
            quantidade: item.quantity
        }));

        try {
            orderService.setAuthToken(user.token);

            checkoutButton.disabled = true;
            checkoutButton.textContent = "Enviando pedido...";

            const response = await orderService.create(items);

            if (response.code && response.code !== 201) {
                throw new Error(response.message || "Não foi possível realizar o pedido.");
            }

            alert("Pedido realizado com sucesso!");

            cart = [];
            renderCart();

            if (cartPanel) {
                cartPanel.hidden = true;
            }

        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
            alert(error.message || "Erro ao realizar pedido. Tente novamente.");

        } finally {
            checkoutButton.disabled = false;
            checkoutButton.textContent = "Finalizar pedido";
        }
    });
}

// Renderizar produtos
function renderProducts(list) {
    productsGrid.innerHTML = "";

    productsCount.textContent =
        list.length + (list.length === 1
            ? " produto encontrado"
            : " produtos encontrados");

    if (list.length === 0) {
        productsGrid.textContent = "Nenhum produto encontrado.";
        return;
    }

    list.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = getImageUrl(
            product.photo,
            "assets/images/default-product.svg"
        );
        image.alt = product.name;

        const favoriteButton = document.createElement("button");
        favoriteButton.className = "favorite-button";
        favoriteButton.type = "button";
        favoriteButton.textContent = "♡";

        favoriteButton.addEventListener("click", () => {
            favoriteButton.textContent =
                favoriteButton.textContent === "♡" ? "♥" : "♡";
        });

        const info = document.createElement("section");
        info.className = "product-info";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const store = document.createElement("p");
        store.textContent = product.storeName || "Ateliê";

        const price = document.createElement("p");
        price.textContent = formatPrice(product.price);

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "add-cart-button";
        addButton.textContent = "Adicionar ao carrinho";

        addButton.addEventListener("click", () => {
            addToCart(product);
        });

        info.append(name, store, price, addButton);
        card.append(image, favoriteButton, info);

        productsGrid.append(card);
    });
}

// Aplicar filtros
function filterProducts() {
    const search = searchInput.value.toLowerCase().trim();

    let filtered = products.filter(product => {
        return product.name.toLowerCase().includes(search);
    });

    const selectedCategories = Array.from(categoryFilters)
        .filter(input => input.checked)
        .map(input =>
            categoryMap[input.parentElement.textContent.trim()] || []
        );

    if (selectedCategories.length > 0) {
        const categoryIds = selectedCategories.flat();

        filtered = filtered.filter(product =>
            categoryIds.includes(Number(product.categoryId))
        );
    }

    const selectedPrice = Array.from(priceFilters)
        .find(input => input.checked);

    if (selectedPrice) {
        const priceIndex = Array.from(priceFilters).indexOf(selectedPrice);

        filtered = filtered.filter(product => {
            const price = Number(product.price);

            if (priceIndex === 0) return price <= 50;
            if (priceIndex === 1) return price > 50 && price <= 100;
            if (priceIndex === 2) return price > 100 && price <= 200;
            if (priceIndex === 3) return price > 200;

            return true;
        });
    }

    if (sortProducts.value === "Menor Preço") {
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortProducts.value === "Maior Preço") {
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    renderProducts(filtered);
}

// Eventos dos filtros
categoryFilters.forEach(input => {
    input.addEventListener("change", filterProducts);
});

priceFilters.forEach(input => {
    input.addEventListener("change", filterProducts);
});

if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

if (sortProducts) {
    sortProducts.addEventListener("change", filterProducts);
}

// Limpar filtros
if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
        categoryFilters.forEach(input => {
            input.checked = false;
        });

        priceFilters.forEach(input => {
            input.checked = false;
        });

        searchInput.value = "";
        sortProducts.selectedIndex = 0;

        filterProducts();
    });
}

// Carregar FAQs
async function fetchFAQs() {
    try {
        const result = await faqService.list();

        const listFaqs = document.querySelector(".faq-section");

        if (!listFaqs) return;

        listFaqs.querySelectorAll("details").forEach(item => item.remove());

        result.data.forEach(faq => {
            const item = document.createElement("details");
            item.className = "faq-item";

            const question = document.createElement("summary");
            question.textContent = faq.question;

            const answer = document.createElement("p");
            answer.textContent = faq.answer;

            item.append(question, answer);
            listFaqs.append(item);
        });

    } catch (error) {
        console.error("Erro ao carregar FAQs:", error);
    }
}

// Perfil
const profileButton = document.querySelector(".profile-button");

if (profileButton) {
    profileButton.addEventListener("click", function (event) {
        event.preventDefault();

        const user = getUser();

        if (user && Number(user.typeId) === 2) {
            window.location.href = "accountCrochet.html";
        } else if (user && Number(user.typeId) === 1) {
            window.location.href = "account.html";
        } else {
            window.location.href = "login.html";
        }
    });
}

// Inicialização
renderCart();
loadProducts();
fetchFAQs();
