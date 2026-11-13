
import ProductService from "../../_common/classes/ProductService.js";

const productService = new ProductService();

const fileInput = document.querySelector("#file-input");
const dropzone = document.querySelector("#dropzone");
const productForm = document.querySelector("#product-form");

let uploadedImages = [];

// Alternar visibilidade do prazo sob encomenda
function toggleCustomDays() {
    const checkbox = document.getElementById("prod-custom");
    const customDaysGroup = document.getElementById("custom-days-group");

    if (checkbox.checked) {
        customDaysGroup.style.display = "flex";
    } else {
        customDaysGroup.style.display = "none";
    }

    updateLivePreview();
}

// Atualização da pré-visualização
function updateLivePreview() {
    const name = document.getElementById("prod-name").value;
    const category = document.getElementById("prod-category").value;
    const price = parseFloat(document.getElementById("prod-price").value) || 0;
    const oldPrice = parseFloat(document.getElementById("prod-old-price")?.value) || 0;
    const stock = parseInt(document.getElementById("prod-stock").value) || 0;
    const isCustom = document.getElementById("prod-custom").checked;
    const leadTime = document.getElementById("prod-lead-time").value || 7;
    const status = document.getElementById("prod-status").value;

    // Nome
    document.getElementById("preview-title-display").textContent =
        name.trim() !== "" ? name : "Nome do Seu Produto";

    // Categoria
    const categorySelect = document.getElementById("prod-category");
    const categoryName = categorySelect.options[categorySelect.selectedIndex]?.text;

    document.getElementById("preview-category-display").textContent =
        category !== "" ? categoryName : "Categoria Selecionada";

    // Preço
    document.getElementById("preview-price-display").textContent =
        `R$ ${price.toFixed(2).replace(".", ",")}`;

    // Preço antigo
    const oldPriceElem = document.getElementById("preview-old-price-display");

    if (oldPriceElem) {
        if (oldPrice > price && oldPrice > 0) {
            oldPriceElem.textContent =
                `R$ ${oldPrice.toFixed(2).replace(".", ",")}`;
        } else {
            oldPriceElem.textContent = "";
        }
    }

    // Estoque
    const stockDisplay = document.getElementById("preview-stock-display");
    const dot = document.getElementById("preview-dot");

    if (isCustom) {
        stockDisplay.textContent = `Sob encomenda (${leadTime} dias úteis)`;
        dot.style.backgroundColor = "#f59e0b";
    } else if (stock > 0) {
        stockDisplay.textContent = `${stock} unidade(s) pronta entrega`;
        dot.style.backgroundColor = "#22c55e";
    } else {
        stockDisplay.textContent = "Sem estoque no momento";
        dot.style.backgroundColor = "#ef4444";
    }

    // Status
    const statusBadge = document.getElementById("preview-status-badge");

    if (status === "Ativo") {
        statusBadge.textContent = "● Ativo";
        statusBadge.style.color = "#22c55e";
    } else {
        statusBadge.textContent = "● Rascunho";
        statusBadge.style.color = "#6b7280";
    }
}

// Seleção de arquivos
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

// Processar imagens
function processFiles(files) {
    files.forEach(file => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = function (event) {
                uploadedImages.push(event.target.result);
                renderPreviews();
            };

            reader.readAsDataURL(file);
        }
    });
}

// Mostrar pré-visualizações das imagens
function renderPreviews() {
    const grid = document.getElementById("previews-grid");
    const previewContainer = document.getElementById("preview-image-container");

    grid.innerHTML = "";

    if (uploadedImages.length > 0) {
        previewContainer.innerHTML = `
            <img src="${uploadedImages[0]}" alt="Foto principal do produto">
        `;

        uploadedImages.forEach((imgSrc, index) => {
            const container = document.createElement("div");
            container.className = "preview-thumb-container";

            const image = document.createElement("img");
            image.src = imgSrc;
            image.className = "preview-thumb";
            image.alt = `Imagem ${index + 1}`;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "remove-thumb-btn";
            button.textContent = "✕";
            button.addEventListener("click", () => removeImage(index));

            container.appendChild(image);
            container.appendChild(button);

            grid.appendChild(container);
        });
    } else {
        previewContainer.innerHTML = `
            <span style="font-size: 32px; color: #d67da3;">🧶</span>
            <span style="font-size: 12px; color: #a08899; margin-top: 6px;">
                Envie uma imagem para visualizar
            </span>
        `;
    }
}

// Remover imagem
function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderPreviews();
}

// Upload de imagens
if (fileInput) {
    fileInput.addEventListener("change", handleFileSelect);
}

// Drag and Drop
if (dropzone) {
    ["dragenter", "dragover"].forEach(eventName => {
        dropzone.addEventListener(eventName, event => {
            event.preventDefault();
            dropzone.classList.add("dragover");
        });
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropzone.addEventListener(eventName, event => {
            event.preventDefault();
            dropzone.classList.remove("dragover");
        });
    });

    dropzone.addEventListener("drop", event => {
        const files = Array.from(event.dataTransfer.files);
        processFiles(files);
    });
}

// Cadastrar produto
async function handleProductSubmit(event) {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token || !user.id) {
        showToast("Faça login novamente.");
        return;
    }

    if (!fileInput.files.length) {
        showToast("Selecione uma imagem para o produto.");
        return;
    }

    productService.setAuthToken(user.token);

    const formData = new FormData();

    formData.append("categoryId", document.getElementById("prod-category").value);
    formData.append("name", document.getElementById("prod-name").value.trim());
    formData.append("price", document.getElementById("prod-price").value);

    formData.append(
        "active",
        document.getElementById("prod-status").value === "Ativo" ? 1 : 0
    );

    formData.append(
        "bio",
        document.getElementById("prod-desc").value.trim()
    );

    formData.append("stock", document.getElementById("prod-stock").value);
    formData.append("photo", fileInput.files[0]);

    console.log("Dados enviados:", Object.fromEntries(formData));

    try {
        const response = await productService.post("/products/", formData);

        console.log("Resposta do cadastro:", response);

        if (response.status !== "success") {
            showToast(response.message || "Não foi possível cadastrar o produto.");
            return;
        }

        showToast("Produto cadastrado com sucesso!");
        resetForm();

    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        showToast("Erro ao cadastrar. Confira o Console (F12).");
    }
}

// Salvar como rascunho
function saveDraft() {
    document.getElementById("prod-status").value = "Rascunho";
    updateLivePreview();
    showToast("💾 Produto salvo como rascunho!");
}

// Limpar formulário
function resetForm() {
    document.getElementById("product-form").reset();

    uploadedImages = [];

    renderPreviews();
    toggleCustomDays();
    updateLivePreview();

    showToast("Formulário redefinido.");
}

// Evento do formulário
if (productForm) {
    productForm.addEventListener("submit", handleProductSubmit);
}

// Toast
function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

// Dados da crocheteira logada
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    const artisanName = document.querySelector(".artisan-name");
    const storeName = document.querySelector(".store-name");

    if (artisanName) {
        artisanName.textContent = user.artName || user.name || "";
    }

    if (storeName) {
        storeName.textContent = user.storeName || "";
    }
}

// Foto de perfil
const headerPhoto = document.getElementById("header-profile-photo");

if (headerPhoto) {
    headerPhoto.src = user && user.photo
        ? user.photo
        : "assets/images/default-profile.svg";
}

// Disponibilizar funções usadas pelo HTML
window.updateLivePreview = updateLivePreview;
window.toggleCustomDays = toggleCustomDays;
window.saveDraft = saveDraft;
window.resetForm = resetForm;

// Atualizar pré-visualização inicial
updateLivePreview();
