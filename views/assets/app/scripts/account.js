import Users from "../../_common/classes/Users.js";

const users = new Users();

const menuButtons = document.querySelectorAll(".menu-button");
const profile = document.querySelector("#profile");
const orders = document.querySelector("#orders");
const config = document.querySelector("#config");
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

// const user = JSON.parse(localStorage.getItem("user"));
const user = JSON.parse(localStorage.getItem("user")) || {};


// LOGO
logoButton.addEventListener("click", () => {
    window.location.href = "home.html";
});


// MENU LATERAL
menuButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        menuButtons.forEach((item) => {
            item.classList.remove("active-menu");
        });

        button.classList.add("active-menu");

        profile.classList.remove("active-content");
        orders.classList.remove("active-content");
        config.classList.remove("active-content");

        if (index === 0) {
            profile.classList.add("active-content");
        }

        if (index === 1) {
            orders.classList.add("active-content");
        }

        if (index === 2) {
            config.classList.add("active-content");
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

        tabButtons.forEach((item) => {
            item.classList.remove("active-tab");
        });

        button.classList.add("active-tab");

        favoritesContent.classList.remove("active-content");
        ordersContent.classList.remove("active-content");
        dataContent.classList.remove("active-content");

        if (index === 0) {
            ordersContent.classList.add("active-content");
        }

        if (index === 1) {
            favoritesContent.classList.add("active-content");
        }

        if (index === 2) {
            dataContent.classList.add("active-content");
        }

    });

});


// PÁGINA INICIAL
paginaInicial.addEventListener("click", () => {
    window.location.href = "home.html";
});


// MOSTRAR DADOS DO USUÁRIO
if (user) {
    document.querySelector("#user-name").textContent = user.name || "";
    document.querySelector("#profile-name").textContent = user.name || "";

    document.querySelector("#name").value = user.name || "";
    document.querySelector("#email").value = user.email || "";
    document.querySelector("#city").value = user.address || "";
    document.querySelector("#bio").value = user.bio || "";

    document.querySelector(".bio").textContent = user.bio || "";
    document.querySelector(".city").textContent = user.address || "";
}


// BOTÃO EDITAR PERFIL
editProfileButton.addEventListener("click", () => {

    dataContent.classList.add("active-content");

    tabButtons.forEach((button) => {
        button.classList.remove("active-tab");
    });

    tabButtons[2].classList.add("active-tab");

});


accountForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!user.id) {
    alert("Usuário não encontrado. Faça login novamente.");
    return;
}

    const name = document.querySelector("#name").value.trim();//remove espaços no inicio e final
    const email = document.querySelector("#email").value.trim();
    const address = document.querySelector("#city").value.trim();
    const bio = document.querySelector("#bio").value.trim();
    const password = document.querySelector("#password").value;

    if (!name || !email) {
        alert("Nome e e-mail são obrigatórios.");
        return;
    }

    const data = { name, email, address, bio};

    if (password) {
        data.password = password;
    }

    try {
        users.setAuthToken(user.token);

        console.log("Dados enviados:", data);

        const response = await users.updateClient(data);

        console.log("Resposta da atualização:", response);

        user.name = name;
        user.email = email;
        user.address = address;
        user.bio = bio;

        localStorage.setItem("user", JSON.stringify(user));

        document.querySelector("#user-name").textContent = name;
        document.querySelector("#profile-name").textContent = name;

        document.querySelector("#password").value = "";

        alert("Dados atualizados com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert("Não foi possível atualizar seus dados.");
    }
});


// CANCELAR
cancelButton.addEventListener("click", () => {

    if (!user) {
        return;
    }

    document.querySelector("#name").value = user.name || "";
    document.querySelector("#email").value = user.email || "";
    document.querySelector("#password").value = "";

});


deleteButton.addEventListener("click", async () => {
    const confirmation = confirm(
        "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
    );

    if (!confirmation) return;

    if (!user || !user.token) {
        alert("Faça login novamente.");
        return;
    }

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
});
