const registerForm = document.querySelector("#register-form");

const typeCards = document.querySelectorAll(".type-card");

const login = document.querySelector("#loginButton");

const register = document.querySelector("#registerButton");

let selectedType = "client";

typeCards.forEach((card) => {

    card.addEventListener("click", () => {

        typeCards.forEach((item) => {

            item.classList.remove("active-type");

        });

        card.classList.add("active-type");

        selectedType = card.dataset.type;

        console.log(selectedType);

    });

});

loginButton.addEventListener("click", () => {

    window.location.href = "login.html";

});

registerButton.addEventListener("click", () => {

    window.location.href = "register.html";

});

registerForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const inputName = document.querySelector("#name");
    const inputEmail = document.querySelector("#email");

    localStorage.setItem("userName", inputName.value);

    localStorage.setItem("userEmail", inputEmail.value);

    localStorage.setItem("userType", selectedType);

    if(selectedType === "seller") {

        window.location.href = "dashboard.html";

    } else {

        window.location.href = "home.html";

    }

});