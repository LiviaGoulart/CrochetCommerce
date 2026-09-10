class Login {

    constructor() {
        this.loginForm = document.querySelector("#login-form");
        this.register = document.querySelector("#register");
        this.login = document.querySelector("#login");
        this.registerLink = document.querySelector(".register-link");

        this.init();
    }

    init() {
        this.registerPage();
        this.submit();
    }

    registerPage() {

        this.register.addEventListener("click", () => {
            window.location.href = "register.html";
        });

        this.registerLink.addEventListener("click", () => {
            window.location.href = "register.html";
        });

    }

    submit() {

        this.loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;

            const data = {
                email: email,
                password: password
            };


            fetch("../api/users/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            })

            .then(response => response.json())

            .then(result => {

                console.log(result);

                if (result.type === "success") {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(result.data)
                    );

                if (result.data.typeId === 2) {
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

new Login();