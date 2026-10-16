
import Users from "../../_common/classes/Users.js";
import { Toast } from "../../_common/classes/Toast.js";
import { LoginFormController } from "../../_common/classes/FormController.js";

const userService = new Users();
const users = new Users();

class Login {

    constructor() {
        this.loginForm = document.querySelector("#login-form");
        this.register = document.querySelector("#register");
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
    this.loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        ///console.log("1 - SUBMIT FOI EXECUTADO");

        if (!LoginFormController.validate(this.loginForm)) {
            //console.log("2 - VALIDAÇÃO FALHOU");
            return;
        }

        //console.log("3 - VALIDAÇÃO OK");

       try {
    const formData = new FormData(this.loginForm);

    const email = formData.get("email");
    const password = formData.get("password");

    const result = await userService.loginGeral(email, password);

    if (result.code === 200) {
        console.log("Dados recebidos do login:", result.data);

        localStorage.setItem("user", JSON.stringify(result.data));

        if (Number(result.data.typeId) === 2) {
            window.location.href = "dashboard.html";
        }
         else if (Number(result.data.typeId) === 1) {
            window.location.href = "home.html";
        } 
        else {
            console.error("Tipo de usuário desconhecido:", result.data.typeId);
        }
    }
} catch (error) {
    console.error("ERRO NO LOGIN:", error);
    Toast.show("Não foi possível realizar o login.", "error");
}
    });
}

}

new Login();