import OrderService from "../../_common/classes/OrderService.js";

const orderService = new OrderService();

const user = JSON.parse(localStorage.getItem("user"));

const ordersList = document.querySelector("#orders-list");

const pendingCount = document.querySelector("#pending-count");
const craftingCount = document.querySelector("#crafting-count");
const shippedCount = document.querySelector("#shipped-count");
const completedCount = document.querySelector("#completed-count");

// Foto do perfil
const headerPhoto = document.querySelector("#header-profile-photo");

if (headerPhoto) {
    if (user && user.photo) {
        headerPhoto.src = user.photo.startsWith("http")
            ? user.photo
            : "http://localhost/crochet/" + user.photo;
    } else {
        headerPhoto.src = "assets/images/default-profile.svg";
    }
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
}

// Formatar valores
function formatPrice(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Formatar data
function formatDate(date) {
    if (!date) return "Data não informada";

    const parsedDate = new Date(date.replace(" ", "T"));

    if (isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("pt-BR");
}

// Atualizar contadores
function updateCounters(orders) {
    if (pendingCount) {
        pendingCount.textContent = orders.filter(order =>
            order.status.toLowerCase() === "pendente"
        ).length;
    }

    if (craftingCount) {
        craftingCount.textContent = orders.filter(order =>
            order.status.toLowerCase() === "em confecção"
        ).length;
    }

    if (shippedCount) {
        shippedCount.textContent = orders.filter(order =>
            order.status.toLowerCase() === "enviado"
        ).length;
    }

    if (completedCount) {
        completedCount.textContent = orders.filter(order =>
            order.status.toLowerCase() === "concluído" ||
            order.status.toLowerCase() === "concluido"
        ).length;
    }
}

// Criar card de pedido
function createOrderCard(order) {
    const card = document.createElement("article");
    card.className = "order-card";

    const header = document.createElement("section");
    header.className = "order-header";

    const title = document.createElement("h3");
    title.textContent = "Pedido";

    const status = document.createElement("span");
    status.className = "order-status";
    status.textContent = order.status || "Pendente";

    header.append(title, status);

    const customer = document.createElement("p");
    customer.textContent = "Cliente: " +
        (order.cliente_nome || "Cliente");

    const email = document.createElement("p");
    email.textContent = "E-mail: " +
        (order.cliente_email || "Não informado");

    const date = document.createElement("p");
    date.textContent = "Data: " + formatDate(order.date_order);

    const itemsSection = document.createElement("section");
    itemsSection.className = "order-products";

    const itemsTitle = document.createElement("h4");
    itemsTitle.textContent = "Produtos do pedido";

    itemsSection.append(itemsTitle);

    (order.items || []).forEach(item => {
        const itemArticle = document.createElement("article");
        itemArticle.className = "order-product";

        const productName = document.createElement("p");
        productName.textContent = item.produto_nome || "Produto";

        const quantity = document.createElement("p");
        quantity.textContent = "Quantidade: " + item.quantidade;

        const price = document.createElement("p");
        price.textContent = "Preço unitário: " + formatPrice(item.price);

        itemArticle.append(productName, quantity, price);
        itemsSection.append(itemArticle);
    });

    const total = document.createElement("p");
    total.className = "order-total";
    total.textContent = "Total: " + formatPrice(order.total_price);

    // Botão para atualizar o andamento do pedido
const nextStatuses = {
    "Pendente": {
        label: "Aceitar pedido",
        status: "Em Confecção"
    },
    "Em Confecção": {
        label: "Marcar como enviado",
        status: "Enviado"
    },
    "Enviado": {
        label: "Concluir pedido",
        status: "Concluído"
    }
};

const footer = document.createElement("section");
footer.className = "order-card-footer";

const next = nextStatuses[order.status];

if (next) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "btn-order-primary";
    button.textContent = next.label;

    button.addEventListener("click", async () => {
        button.disabled = true;
        button.textContent = "Atualizando...";

        try {
            const response = await orderService.updateStatus(
                order.id,
                next.status
            );

            if (response.code !== 200) {
                throw new Error(response.message || "Erro ao atualizar pedido.");
            }

            await loadOrders();

        } catch (error) {
            alert(error.message);
            button.disabled = false;
            button.textContent = next.label;
        }
    });

    footer.append(button);
}

    card.append(
    header,
    customer,
    email,
    date,
    itemsSection,
    total,
    footer
);

    return card;
}

// Carregar pedidos
async function loadOrders() {
    if (!user || !user.token) {
        ordersList.textContent = "Faça login para visualizar os pedidos.";
        return;
    }

    if (Number(user.typeId) !== 2) {
        ordersList.textContent = "Esta área é exclusiva para crocheteiras.";
        return;
    }

    orderService.setAuthToken(user.token);

    try {
        const response = await orderService.list();
console.log("RESPOSTA DOS PEDIDOS:", response);
        if (response.code !== 200) {
            throw new Error(response.message || "Erro ao buscar pedidos.");
        }

        const orders = response.data || [];

        updateCounters(orders);

        ordersList.innerHTML = "";

        if (orders.length === 0) {
            ordersList.textContent = "Você ainda não recebeu pedidos.";
            return;
        }

        orders.forEach(order => {
            ordersList.append(createOrderCard(order));
        });

    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        ordersList.textContent = "Não foi possível carregar os pedidos.";
    }
}

loadOrders();
