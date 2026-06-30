const favoriteButtons = document.querySelectorAll(".favorite-button");
const profileButton = document.querySelector("#profileIcon");


profileButton.addEventListener("click", () => {
    console.log("clicando");
    window.location.href = "account.html";
})

favoriteButtons.forEach((button) => {

    button.addEventListener("click", () => {

        if(button.textContent === "♡") {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});

const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("input", () => {

    console.log(searchInput.value);

});

const sortProducts = document.querySelector("#sort-products");

sortProducts.addEventListener("change", () => {

    console.log(sortProducts.value);

});