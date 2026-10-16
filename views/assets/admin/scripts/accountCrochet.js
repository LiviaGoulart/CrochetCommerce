
    // Função para alternar entre as abas da tela de conta
    function openTab(evt, tabId) {
        var i, tabpane, tabbuttons;

        // Esconde todos os painéis
        tabpane = document.getElementsByClassName("tab-pane");
        for (i = 0; i < tabpane.length; i++) {
            tabpane[i].classList.remove("active-pane");
        }

        // Remove a classe 'active-tab' de todos os botões
        tabbuttons = document.getElementsByClassName("tab-button");
        for (i = 0; i < tabbuttons.length; i++) {
            tabbuttons[i].classList.remove("active-tab");
        }

        // Exibe o painel atual e marca o botão como ativo
        document.getElementById(tabId).classList.add("active-pane");
        if (evt) {
            evt.currentTarget.classList.add("active-tab");
        }
    }

    // Atalho para alternar abas diretamente via clique externo
    function switchTab(tabId) {
        var buttons = document.getElementsByClassName("tab-button");
        var targetIndex = 0;
        if(tabId === 'tab-banco') targetIndex = 1;
        if(tabId === 'tab-envio') targetIndex = 2;
        if(tabId === 'tab-avaliacoes') targetIndex = 3;
        
        buttons[targetIndex].click();
    }

    // Feedback visual ao salvar formulários
    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Atualiza dinamicamente o cabeçalho do perfil se for a aba do ateliê
        const storeNameInput = document.getElementById('store-name');
        const bioInput = document.getElementById('bio-input');
        const cityInput = document.getElementById('city-uf');

        if(storeNameInput && storeNameInput.value) {
            document.getElementById('store-name-display').innerText = storeNameInput.value;
        }
        if(bioInput && bioInput.value) {
            document.getElementById('bio-display').innerText = bioInput.value;
        }
        if(cityInput && cityInput.value) {
            document.getElementById('city-display').innerText = '📍 ' + cityInput.value + ' • Atendimento Nacional';
        }

        alert('✓ Alterações salvas com sucesso!');
    }


    //começando AQUI
    
    import Users from "../../_common/classes/Users.js";

    const user = JSON.parse(localStorage.getItem("user"));
    const users = new Users();

        const dasshboard = document.querySelector("#dashboard");
    dashboard.addEventListener("click", () => {
        console.log("clicoy");
        window.location.href = "dashboard.html";
    })

        const newProduct = document.querySelector(".new-product-button");
    newProduct.addEventListener("click", () => {
        window.location.href = "newProduct.html";
    })

 // MOSTRAR DADOS DO USUÁRIO
if (user) {
   document.querySelector("header .artisan-name").textContent =
        user.artName || user.name || "Nome não encontrado";

    document.querySelector("#atelie-form .artisan-name").value =
    user.artName || user.name || "";

    document.querySelector("header .store-name").textContent =
    user.storeName || "";

    document.querySelector("#email").value = user.email || "";
    document.querySelector("#address").value = user.address || "";
    document.querySelector("#bio").value = user.bio || "";

    document.querySelector("#bio-display").textContent = user.bio || "";
    document.querySelector("#city-display").textContent = user.address || "";
}

// ATUALIZAR DADOS
const formControl = document.querySelector("#atelie-form");

formControl.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Formulário encontrado:", formControl);

    if (!user || !user.id) {
        alert("Usuário não encontrado. Faça login novamente.");
        return;
    }

    const name = document.querySelector("#atelie-form .artisan-name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const storeName = document.querySelector("#atelie-form .store-name").value.trim();
    const address = document.querySelector("#address").value.trim();
    const bio = document.querySelector("#bio").value.trim();
    const cpf = document.querySelector("#cpf-cnpj").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const instagram = document.querySelector("#instagram").value.trim();

    if (!name || !email) {
        alert("Nome e e-mail são obrigatórios.");
        return;
    }

    const data = {
        name: name,
        artName: name,
        storeName: storeName,
        email: email,
        address: address,
        bio: bio,
        cpf: cpf,
        phone: phone,
        instagram: instagram
    };

   users.setAuthToken(user.token);

console.log("Dados enviados:", data);

const response = await users.update(data);

console.log("Resposta da atualização:", response);

user.name = name;
user.artName = name;
user.storeName = storeName;
user.email = email;
user.address = address;
user.bio = bio;

localStorage.setItem("user", JSON.stringify(user));

document.querySelector("header .artisan-name").textContent = name;
document.querySelector("header .store-name").textContent = storeName;
//document.querySelector("#atelie-form .store-name").value = user.storeName;
document.querySelector("#store-name-display").textContent = storeName;
document.querySelector("#bio-display").textContent = bio;
document.querySelector("#city-display").textContent = address;

alert("Dados atualizados com sucesso!");
});


// CANCELAR
const cancelButton = document.querySelector(".cancel-button");
cancelButton.addEventListener("click", () => {

    if (!user) {
        return;
    }

    document.querySelector(".store-name").value = user.storeName || "";//store
    document.querySelector(".artisan-name").value = user.artName || "";
    document.querySelector("#cpf-cnpj").value = user.cpf || "";
    document.querySelector("#phone").value = user.phone || "";
    document.querySelector("#email").value = user.email || "";
    document.querySelector("#address").value = user.address || "";
    document.querySelector("#bio").value = user.bio || "";
    document.querySelector("#instagram").value = user.instagram || "";

});

//DELETAR crochet
const deleteButton = document.querySelector(".delete-button");
deleteButton.addEventListener("click", async () => {
    const confirmation = confirm(
        "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
    );

    if (!confirmation) return;

    if (!user || !user.token) {
        alert("Faça login novamente.");
        return;
    }

    users.setAuthToken(user.token);

    const response = await users.deleteCrochet();

    console.log("Resposta da exclusão:", response);

    if (response.code === 200) {
        localStorage.removeItem("user");
        alert("Conta excluída com sucesso!");
        window.location.href = "login.html";
    } else {
        alert(response.message || "Não foi possível excluir sua conta.");
    }
});
