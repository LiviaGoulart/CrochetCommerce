const menuButtons = document.querySelectorAll(".menu-button");

menuButtons.forEach((button) => {

    button.addEventListener("click", () => {

        menuButtons.forEach((item) => {

            item.classList.remove("active-menu");

        });

        button.classList.add("active-menu");

    });

});

const searchProduct = document.querySelector("#search-product");

searchProduct.addEventListener("input", () => {

    console.log(searchProduct.value);

});

const statusFilter = document.querySelector("#status-filter");

statusFilter.addEventListener("change", () => {

    console.log(statusFilter.value);

});

const categoryFilter = document.querySelector("#category-filter");

categoryFilter.addEventListener("change", () => {

    console.log(categoryFilter.value);

});