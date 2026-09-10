
const menuButtons = document.querySelectorAll(".menu-button");
const profile = document.querySelector("#profile");
const orders = document.querySelector("#orders");
const config = document.querySelector("#config");
const ordersTab = document.querySelector("#orders-tab");


const tabButtons = document.querySelectorAll(".tab-button");
const favoritesContent = document.querySelector(".favorites-content");

const ordersContent = document.querySelector(".orders-content");

const dataContent = document.querySelector(".data-content");

const paginaInicial = document.querySelector(".paginaInicial");


//para botões no menu
menuButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        menuButtons.forEach((item) => {

            item.classList.remove("active-menu");

        });

        button.classList.add("active-menu");

        profile.classList.remove("active-content");

        orders.classList.remove("active-content");

        config.classList.remove("active-content");

        if(index === 0) {

            profile.classList.add("active-content");

        }

        if(index === 1) {

            orders.classList.add("active-content");

        }

        if(index === 2) {

            config.classList.add("active-content");

        }

    });

});

orders.addEventListener("click", () => {
    ordersTab.click();
})


//para os botões da tabela
tabButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        tabButtons.forEach((item) => {

            item.classList.remove("active-tab");

        });

        button.classList.add("active-tab");

        favoritesContent.classList.remove("active-content");

        ordersContent.classList.remove("active-content");

        dataContent.classList.remove("active-content");

        if(index === 0) {

            ordersContent.classList.add("active-content");

        }

        if(index === 1) {

            favoritesContent.classList.add("active-content");

        }

        if(index === 2) {

            dataContent.classList.add("active-content");

        }

    });

});

paginaInicial.addEventListener("click", () => {
    window.location.href = "home.html";
})

const accountForm = document.querySelector("#account-form");

accountForm.addEventListener("submit", (event) => {

    event.preventDefault();

    alert("Dados salvos");

});


const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.querySelector("#user-name").textContent = user.name;
    document.querySelector("#profile-name").textContent = user.name;
}