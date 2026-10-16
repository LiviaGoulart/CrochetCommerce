import ProductService from "../../_common/classes/ProductService.js";

const productService = new ProductService();


//MENU

const menuButtons = document.querySelectorAll(".menu-button");

menuButtons.forEach((button) => {

    button.addEventListener("click", () => {

        menuButtons.forEach((item) => {
            item.classList.remove("active-menu");
        });

        button.classList.add("active-menu");

    });

});


const conta = document.querySelector("#perfil");

    conta.addEventListener("click", () => {
        console.log("clicou");
        window.location.href= "accountCrochet.html";
    })

//PRODUTOS

const newProduct = document.querySelector(".new-product-button");
newProduct.addEventListener("click", () => {
    window.location.href = "newProduct.html";
})

const productsList = document.querySelector("#products-list");

let products = [];

async function loadProducts() {

    try {

        products = await productService.list();

        renderProducts(products);

    } catch (error) {

        console.error("Erro ao carregar produtos:", error);

    }

}


function renderProducts(productsToShow) {

    productsList.innerHTML = "";

    productsToShow.forEach((product) => {

        const article = document.createElement("article");

        article.classList.add("product-item");

        article.innerHTML = `
            <section class="product-info">

                <h3>${product.name}</h3>

                <p class="price-text">
                    Preço
                </p>

                <span>
                    R$ ${Number(product.price).toFixed(2)}
                </span>

            </section>

            <section class="product-status">

                <p>Status</p>

                <button>
                    ${product.active ? "Ativo" : "Inativo"}
                </button>

            </section>

            <section class="product-actions">

                <button class="edit-product-button">
                    Editar
                </button>

                <button class="delete-product-button">
                    Excluir
                </button>

            </section>
        `;

//EDITAR

        const editButton =
            article.querySelector(".edit-product-button");

        editButton.addEventListener("click", async () => {

            const name = prompt(
                "Nome do produto:",
                product.name
            );

            if (name === null) {
                return;
            }

            const price = prompt(
                "Preço do produto:",
                product.price
            );

            if (price === null) {
                return;
            }

            const updatedProduct = {

                id: product.id,

                usersId: product.usersId,

                categoryId: product.categoryId,

                name: name,

                price: price,

                active: product.active

            };

            try {

                await productService.update(
                    product.id,
                    updatedProduct
                );

                alert("Produto atualizado com sucesso!");

                loadProducts();

            } catch (error) {

                console.error(
                    "Erro ao editar produto:",
                    error
                );

                alert("Não foi possível editar o produto.");

            }

        });

//EXCLUIR

        const deleteButton =
            article.querySelector(".delete-product-button");

        deleteButton.addEventListener("click", async () => {

            const confirmDelete = confirm(
                "Deseja realmente excluir este produto?"
            );

            if (!confirmDelete) {
                return;
            }

            try {

                await productService.remove(product.id);

                alert("Produto excluído com sucesso!");

                loadProducts();

            } catch (error) {

                console.error(
                    "Erro ao excluir produto:",
                    error
                );

                alert("Não foi possível excluir o produto.");

            }

        });


        productsList.appendChild(article);

    });

}

//BUSCAR

const searchProduct =
    document.querySelector("#search-product");

searchProduct.addEventListener("input", () => {

    const search = searchProduct.value.toLowerCase();

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search)
    );

    renderProducts(filteredProducts);

});


//STATUS FILTER

const statusFilter =
    document.querySelector("#status-filter");

statusFilter.addEventListener("change", () => {

    const value = statusFilter.value;

    let filteredProducts = products;

    if (value === "Ativo") {

        filteredProducts =
            products.filter((product) => product.active === 1);

    }

    if (value === "Inativo") {

        filteredProducts =
            products.filter((product) => product.active === 0);

    }

    renderProducts(filteredProducts);

});


//CATEGORY FILTER

const categoryFilter =
    document.querySelector("#category-filter");

categoryFilter.addEventListener("change", () => {

    console.log(categoryFilter.value);

});


//USER

const user =
    JSON.parse(localStorage.getItem("user"));

if (user) {

    document.querySelector("#user-name").textContent =
        user.name;

}

//INICIAR

loadProducts();