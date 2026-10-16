
const ToastPrototype = {
    show(message, type = "success") {
        const toast = document.createElement("p");
        const types = ["success", "warning", "error"];

        toast.className = `toast toast-${types.includes(type) ? type : "error"}`;
        toast.textContent = message || "Operação concluída.";
        toast.setAttribute("role", "status");

        document.body.append(toast);

        setTimeout(() => toast.remove(), 4000);
    },

    fromResponse(response) {
        if (!response || typeof response !== "object") {
            this.show("Resposta inesperada da API.", "error");
            return;
        }

        const type = ["success", "warning", "error"].includes(response.type)
            ? response.type
            : "error";

        const message = typeof response.message === "string"
            ? response.message
            : "A API retornou uma resposta inesperada.";

        this.show(message, type);
    }
};

const Toast = Object.create(ToastPrototype);
const FormToast = Object.create(ToastPrototype);

export { Toast, FormToast };

