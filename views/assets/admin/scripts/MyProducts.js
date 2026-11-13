
import ProductService from "../../_common/classes/ProductService.js";
import Products from "../../_common/classes/Products.js";

const productService = new ProductService();

const productsGrid = document.querySelector("#products-grid");
const searchInput = document.querySelector("#search-product");
const categoryFilter = document.querySelector("#category-filter");

let products = [];

// Dados da crocheteira logada
const user = JSON.parse(localStorage.getItem("user"));

// Foto de perfil no cabeçalho
const headerPhoto = document.getElementById("header-profile-photo");

if (headerPhoto) {
    headerPhoto.src = user?.photo || "assets/images/default-profile.svg";
}

// Dados da crocheteira
if (user) {
    const artisanName = document.querySelector(".artisan-name");
    const storeName = document.querySelector(".store-name");

    if (artisanName) {
        artisanName.textContent = user.artName || user.name;
    }

    if (storeName) {
        storeName.textContent = user.storeName || "";
    }

    if (user.token) {
        productService.setAuthToken(user.token);
    }
}

// Buscar produtos da API
async function loadProducts() {
    try {
        const response = await productService.list();

        console.log("Produtos recebidos:", response);

        products = response
    .filter(product => Number(product.status ?? product.active) === 1)
    .map(product => {
            const item = new Products(
                product.id,
                product.categoryId ?? product.category_id,
                product.name,
                product.price,
                product.stock,
                product.material ?? product.bio,
                product.status ?? product.active,
                product.photo
            );

            return item;
        });

        console.log("Produtos com fotos:", products);

        renderProducts(products);

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        showToast("Não foi possível carregar os produtos.");
    }
}

// Mostrar produtos na tela
function renderProducts(productsToShow) {
    productsGrid.innerHTML = "";

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    productsToShow.forEach(product => {
        const card = document.createElement("article");
        card.classList.add("product-card");

        const photo = product.photo
            ? (product.photo.startsWith("http")
                ? product.photo
                : "http://localhost/crochet/" + product.photo)
            : null;

        card.innerHTML = `
            <section class="product-image-area">
                ${
                    photo
                        ? `<img src="${photo}" alt="${product.getName()}">`
                        : "<span>Sem imagem</span>"
                }

                <span class="product-badge">
                    ${Number(product.getStatus()) === 1 ? "Ativo" : "Inativo"}
                </span>
            </section>

            <section class="product-details">
                <h3 class="product-title">
                    ${product.getName()}
                </h3>

                <p class="product-price">
                    R$ ${Number(product.getPrice()).toFixed(2).replace(".", ",")}
                </p>

                <p class="product-stock">
                    Estoque: ${product.getStock() ?? "Não informado"}
                </p>


                <p class="product-stock">
                    Categoria: ${product.getCategoryId() || "Não informada"}
                </p>
            </section>
        `;

        // Imagem alternativa caso o arquivo não seja encontrado
        const image = card.querySelector(".product-image-area img");

        if (image) {
            image.addEventListener("error", () => {
                image.remove();

                const message = document.createElement("span");
                message.textContent = "Sem imagem";

                card.querySelector(".product-image-area").prepend(message);
            });
        }

        productsGrid.appendChild(card);
    });
}

// Pesquisa pelo nome
if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

// Filtro por categoria
if (categoryFilter) {
    categoryFilter.addEventListener("change", filterProducts);
}

// Aplicar filtros
function filterProducts() {
    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const category = categoryFilter
        ? categoryFilter.value
        : "";

    const filteredProducts = products.filter(product => {
        const matchesName = product.getName()
            .toLowerCase()
            .includes(search);

        const matchesCategory = !category ||
            String(product.getCategoryId()) === category;

        return matchesName && matchesCategory;
    });

    renderProducts(filteredProducts);
}

// Iniciar listagem
if (productsGrid) {
    loadProducts();
} else {
    console.error("Elemento #products-grid não encontrado.");
}
