import Users from "../../_common/classes/Users.js";
import OrderService from "../../_common/classes/OrderService.js";

const orderService = new OrderService();
const ordersList = document.querySelector("#orders-list");

const users = new Users();

const menuButtons = document.querySelectorAll(".menu-button");
const profile = document.querySelector("#profile");
const orders = document.querySelector("#orders");
const ordersTab = document.querySelector("#orders-tab");
const logoButton = document.querySelector(".logo-button");

const tabButtons = document.querySelectorAll(".tab-button");
const favoritesContent = document.querySelector(".favorites-content");
const ordersContent = document.querySelector(".orders-content");
const dataContent = document.querySelector(".data-content");

const paginaInicial = document.querySelector(".paginaInicial");

const accountForm = document.querySelector("#account-form");
const editProfileButton = document.querySelector(".edit-profile-button");
const cancelButton = document.querySelector(".cancel-button");
const deleteButton = document.querySelector(".delete-account-button");

const photoInput = document.querySelector("#photo-input");
const cameraButton = document.querySelector("#camera-button");
const profilePhoto = document.querySelector("#profile-photo");
const headerProfilePhoto = document.querySelector("#header-profile-photo");
const savePhotoButton = document.querySelector("#btn-save-photo");

const user = JSON.parse(localStorage.getItem("user")) || {};



function formatOrderPrice(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatOrderDate(date) {
    if (!date) return "Data não informada";

    const parsed = new Date(date.replace(" ", "T"));

    if (isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("pt-BR");
}

function createClientOrder(order) {
    const card = document.createElement("article");
    card.className = "customer-order-card";

    const header = document.createElement("section");
    header.className = "customer-order-header";

    const title = document.createElement("h3");
    title.textContent = `Pedido`;

    const status = document.createElement("span");
    status.className = "customer-order-status";
    status.textContent = order.status || "Pendente";

    header.append(title, status);

    const date = document.createElement("p");
    date.className = "customer-order-date";
    date.textContent = "Realizado em " + formatOrderDate(order.date_order);

    const seller = document.createElement("p");
    seller.className = "customer-order-seller";
    seller.textContent = "Loja: " + (order.vendedora_nome || "Crocheteira");

    const products = document.createElement("section");
    products.className = "customer-order-products";

    (order.items || []).forEach(item => {
        const product = document.createElement("article");
        product.className = "customer-order-product";

        const image = document.createElement("img");

        if (item.produto_foto) {
            image.src = item.produto_foto.startsWith("http")
                ? item.produto_foto
                : "http://localhost/crochet/" + item.produto_foto.replace(/^\/+/, "");
        } else {
            image.src = "assets/images/default-profile.svg";
        }

        image.alt = item.produto_nome || "Produto";

        const info = document.createElement("section");

        const name = document.createElement("h4");
        name.textContent = item.produto_nome || "Produto";

        const quantity = document.createElement("p");
        quantity.textContent = `Quantidade: ${item.quantidade}`;

        const price = document.createElement("p");
        price.textContent = formatOrderPrice(item.price);

        info.append(name, quantity, price);
        product.append(image, info);
        products.append(product);
    });

    const total = document.createElement("p");
    total.className = "customer-order-total";
    total.textContent = "Total: " + formatOrderPrice(order.total_price);

    card.append(header, date, seller, products, total);

    return card;
}

async function loadClientOrders() {
    if (!ordersList) return;

    if (!user.token) {
        ordersList.textContent = "Faça login para visualizar seus pedidos.";
        return;
    }

    try {
        orderService.setAuthToken(user.token);

        const response = await orderService.listClient();

        if (response.code !== 200) {
            throw new Error(response.message || "Erro ao carregar pedidos.");
        }

        const orders = response.data || [];

        ordersList.innerHTML = "";

        const ordersCount = document.querySelector("#orders-count");

        if (ordersCount) {
            ordersCount.textContent = orders.length;
        }

        if (orders.length === 0) {
            ordersList.textContent = "Você ainda não realizou nenhum pedido.";
            return;
        }

        orders.forEach(order => {
            ordersList.append(createClientOrder(order));
        });

    } catch (error) {
        console.error("Erro ao carregar pedidos do cliente:", error);
        ordersList.textContent = "Não foi possível carregar seus pedidos.";
    }
}

loadClientOrders();

let selectedPhoto = null;

function getPhotoUrl(photo) {
    if (!photo) {
        return "assets/images/default-profile.svg";
    }

    if (photo.startsWith("http")) {
        return photo;
    }

    return "http://localhost/crochet/" + photo.replace(/^\/+/, "");
}

// LOGO
logoButton.addEventListener("click", () => {
    window.location.href = "home.html";
});



// MENU LATERAL
menuButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        menuButtons.forEach(item => {
            item.classList.remove("active-menu");
        });

        button.classList.add("active-menu");

        if (index === 0) {
            profile.classList.add("active-menu");
            loadClientOrders();
        }

        if (index === 1) {
            ordersTab.click();
            loadClientOrders();
        }
    });
});

// PEDIDOS
orders.addEventListener("click", () => {
    ordersTab.click();
});

// ABAS
tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        tabButtons.forEach(item => {
            item.classList.remove("active-tab");
        });

        button.classList.add("active-tab");

        favoritesContent.classList.remove("active-content");
        ordersContent.classList.remove("active-content");
        dataContent.classList.remove("active-content");

        if (index === 0) {
            ordersContent.classList.add("active-content");
            loadClientOrders();
        }

        if (index === 1) {
            favoritesContent.classList.add("active-content");
            loadClientOrders();
        }

        if (index === 2) {
            dataContent.classList.add("active-content");
            loadClientOrders();
        }
    });
});

// PÁGINA INICIAL
paginaInicial.addEventListener("click", () => {
    window.location.href = "home.html";
});

// DADOS DO USUÁRIO
if (user) {
    document.querySelector("#user-name").textContent = user.name || "";
    document.querySelector("#profile-name").textContent = user.name || "";

    document.querySelector("#name").value = user.name || "";
    document.querySelector("#email").value = user.email || "";
    document.querySelector("#city").value = user.address || "";
    document.querySelector("#bio").value = user.bio || "";

    document.querySelector(".bio").textContent = user.bio || "";
    document.querySelector(".city").textContent = user.address || "";

    profilePhoto.src = getPhotoUrl(user.photo);

    headerProfilePhoto.src = getPhotoUrl(user.photo);
}

// SELECIONAR FOTO
cameraButton.addEventListener("click", () => {
    photoInput.click();
});

// MOSTRAR PRÉVIA
photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem.");
        return;
    }

    selectedPhoto = file;

    profilePhoto.src = URL.createObjectURL(file);
    savePhotoButton.hidden = false;
});

// SALVAR FOTO
savePhotoButton.addEventListener("click", async () => {
    if (!selectedPhoto) {
        alert("Selecione uma foto primeiro.");
        return;
    }

    if (!user.token) {
        alert("Faça login novamente.");
        return;
    }

    try {
        users.setAuthToken(user.token);

        const response = await users.uploadPhotoClient(selectedPhoto);

        console.log("Resposta do upload:", response);

        const photo =
            response.data?.photo ||
            response.data?.photoUrl ||
            response.photo ||
            response.photoUrl;

        if (!photo) {
            console.error("A API não retornou o caminho da foto.");
            alert("A foto foi enviada, mas a API não retornou seu endereço.");
            return;
        }

       user.photo = photo;

localStorage.setItem("user", JSON.stringify(user));

profilePhoto.src = getPhotoUrl(photo);
headerProfilePhoto.src = getPhotoUrl(photo);

        selectedPhoto = null;
        photoInput.value = "";
        savePhotoButton.hidden = true;

        alert("Foto de perfil atualizada com sucesso!");

    } catch (error) {
        console.error("Erro ao salvar foto:", error);
        alert("Não foi possível salvar a foto.");
    }
});

// EDITAR PERFIL
editProfileButton.addEventListener("click", () => {
    dataContent.classList.add("active-content");

    tabButtons.forEach(button => {
        button.classList.remove("active-tab");
    });

    tabButtons[2].classList.add("active-tab");
});

// ATUALIZAR DADOS
accountForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!user.id) {
        alert("Usuário não encontrado. Faça login novamente.");
        return;
    }

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const address = document.querySelector("#city").value.trim();
    const bio = document.querySelector("#bio").value.trim();
    const password = document.querySelector("#password").value;

    if (!name || !email) {
        alert("Nome e e-mail são obrigatórios.");
        return;
    }

    const data = { name, email, address, bio };

    if (password) {
        data.password = password;
    }

    try {
        users.setAuthToken(user.token);

        const response = await users.updateClient(data);

        console.log("Resposta da atualização:", response);

        user.name = name;
        user.email = email;
        user.address = address;
        user.bio = bio;

        localStorage.setItem("user", JSON.stringify(user));

        document.querySelector("#user-name").textContent = name;
        document.querySelector("#profile-name").textContent = name;
        document.querySelector(".bio").textContent = bio;
        document.querySelector(".city").textContent = address;
        document.querySelector("#password").value = "";

        alert("Dados atualizados com sucesso!");

    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert("Não foi possível atualizar seus dados.");
    }
});

// CANCELAR
cancelButton.addEventListener("click", () => {
    document.querySelector("#name").value = user.name || "";
    document.querySelector("#email").value = user.email || "";
    document.querySelector("#city").value = user.address || "";
    document.querySelector("#bio").value = user.bio || "";
    document.querySelector("#password").value = "";
});

// EXCLUIR CONTA
deleteButton.addEventListener("click", async () => {
    const confirmation = confirm(
        "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
    );

    if (!confirmation) return;

    if (!user.token) {
        alert("Faça login novamente.");
        return;
    }

    try {
        users.setAuthToken(user.token);

        const response = await users.deleteClient();

        console.log("Resposta da exclusão:", response);

        if (response.code === 200) {
            localStorage.removeItem("user");
            alert("Conta excluída com sucesso!");
            window.location.href = "login.html";
        } else {
            alert(response.message || "Não foi possível excluir sua conta.");
        }

    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Não foi possível excluir sua conta.");
    }
});