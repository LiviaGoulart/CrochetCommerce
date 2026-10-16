import Users from "../../_common/classes/Users.js";

const userService = new Users();

class Register {

    constructor() {
        this.form = document.querySelector("#register-form");
        this.typeCards = document.querySelectorAll(".type-card");
        this.loginButton = document.querySelector("#loginButton");

        this.selectedType = "client";

        this.init();
    }

    init() {
        this.selectType();
        this.login();
        this.submit();
    }

    selectType() {
    this.typeCards.forEach((card) => {
        card.addEventListener("click", () => {

            this.typeCards.forEach((item) => {
                item.classList.remove("active-type");
            });

            card.classList.add("active-type");

            this.selectedType = card.dataset.type;

            console.log("TIPO ESCOLHIDO:", this.selectedType);
        });
    });
}

    login() {
        this.loginButton.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    submit() {
        this.form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const data = {
                name: document.querySelector("#name").value,
                email: document.querySelector("#email").value,
                password: document.querySelector("#password").value
            };

            try {
                let result;

                if (this.selectedType === "seller") {
                    result = await userService.register(data);
                } else if (this.selectedType === "client") {
                    result = await userService.registerClient(data);
                }

                console.log("Cadastro:", result);

                if (
                    result.type === "created" ||
                    result.type === "success"
                ) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(result.data)
                    );

                    console.log("TIPO ANTES DO CADASTRO:", this.selectedType);

                    if (this.selectedType === "seller") {
                        window.location.href = "dashboard.html";
                    } else if (this.selectedType === "client") {
                        window.location.href = "home.html";
                    }
                } else {
                    alert(
                        result.message ||
                        "Não foi possível realizar o cadastro."
                    );
                }

            } catch (error) {
                console.error("Erro no cadastro:", error);
                alert("Não foi possível realizar o cadastro.");
            }
        });
    }
}

new Register();