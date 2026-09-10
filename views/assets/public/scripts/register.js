class Register {

    constructor() {
        this.form = document.querySelector("#register-form");
        this.typeCards = document.querySelectorAll(".type-card");
        this.loginButton = document.querySelector("#loginButton");

        this.selectedType = "crocheteira";

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

            });

        });

    }

    login() {

        this.loginButton.addEventListener("click", () => {
            window.location.href = "login.html";
        });

    }

    async submit() {

        this.form.addEventListener("submit", async (event) => {

            event.preventDefault();

            const name = document.querySelector("#name").value;
            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;

            const data = {
                name: name,
                email: email,
                password: password
            };


       let route;

       if(this.selectedType==="seller"){
        route = "../api/users/register";
       }
       else{
        route = "../api/users/register-client";
       }

       fetch(route, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            })
            .then(response => response.json())

            .then(result => {

                console.log(result);

                if (result.type === "created") {

                    localStorage.setItem("user", JSON.stringify(result.data));


                    if (this.selectedType === "seller") {
                        window.location.href = "dashboard.html";
                    } else {
                        window.location.href = "home.html";
                    }

                } else {

                    alert(result.message);

                }

            });

        });

    }

}

new Register();