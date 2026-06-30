const loginForm = document.querySelector("#login-form");

const loginTabs = document.querySelectorAll(".login-tabs button");

const register = document.querySelector("#register");

const login = document.querySelector("#login");

const registerLink = document.querySelector(".register-link");

loginTabs.forEach((button) => {

    button.addEventListener("click", () => {

        loginTabs.forEach((tab) => {

            tab.classList.remove("active-tab");

        });

        button.classList.add("active-tab");//ele adiciona para quando clicar, o botão ficar rosa

    });

});

login.addEventListener("click", () => {

    window.location.href = "login.html";

});

register.addEventListener("click", () => {

    window.location.href = "register.html";

});

registerLink.addEventListener("click", () => {

    window.location.href = "register.html";

});

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    alert("Login estático");

});