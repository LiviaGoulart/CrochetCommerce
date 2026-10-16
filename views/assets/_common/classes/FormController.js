
const FormControllerPrototype = {
    serialize(form) {
        return Object.fromEntries(new FormData(form).entries());
    },

    validate(form) {
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        return true;
    },

    clear(form) {
        form.reset();
    }
};

const LoginFormController = Object.create(FormControllerPrototype);
const ProductFormController = Object.create(FormControllerPrototype);

export { LoginFormController, ProductFormController };