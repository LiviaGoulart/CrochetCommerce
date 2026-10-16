
    // Armazenamento das Imagens Selecionadas
    let uploadedImages = [];

    // Alternar visibilidade do prazo sob encomenda
    function toggleCustomDays() {
        const checkbox = document.getElementById('prod-custom');
        const customDaysGroup = document.getElementById('custom-days-group');
        if (checkbox.checked) {
            customDaysGroup.style.display = 'flex';
        } else {
            customDaysGroup.style.display = 'none';
        }
        updateLivePreview();
    }

    // Atualização Interativa da Pré-Visualização do Card
    function updateLivePreview() {
        const name = document.getElementById('prod-name').value;
        const category = document.getElementById('prod-category').value;
        const price = parseFloat(document.getElementById('prod-price').value || 0);
        const oldPrice = parseFloat(document.getElementById('prod-old-price').value || 0);
        const stock = parseInt(document.getElementById('prod-stock').value || 0);
        const isCustom = document.getElementById('prod-custom').checked;
        const leadTime = document.getElementById('prod-lead-time').value || 7;
        const status = document.getElementById('prod-status').value;

        // Atualiza Título
        document.getElementById('preview-title-display').innerText = name.trim() !== '' ? name : 'Nome do Seu Produto';
        
        // Atualiza Categoria
        document.getElementById('preview-category-display').innerText = category !== '' ? category : 'Categoria Selecionada';

        // Atualiza Preço
        document.getElementById('preview-price-display').innerText = `R$ ${price.toFixed(2).replace('.', ',')}`;
        
        // Preço Antigo
        const oldPriceElem = document.getElementById('preview-old-price-display');
        if (oldPrice > price && oldPrice > 0) {
            oldPriceElem.innerText = `R$ ${oldPrice.toFixed(2).replace('.', ',')}`;
        } else {
            oldPriceElem.innerText = '';
        }

        // Status / Estoque
        const stockDisplay = document.getElementById('preview-stock-display');
        const dot = document.getElementById('preview-dot');

        if (isCustom) {
            stockDisplay.innerText = `Sob encomenda (${leadTime} dias úteis)`;
            dot.style.backgroundColor = '#f59e0b'; // Laranja
        } else if (stock > 0) {
            stockDisplay.innerText = `${stock} unidade(s) pronta entrega`;
            dot.style.backgroundColor = '#22c55e'; // Verde
        } else {
            stockDisplay.innerText = 'Sem estoque no momento';
            dot.style.backgroundColor = '#ef4444'; // Vermelho
        }

        // Badge Status
        const statusBadge = document.getElementById('preview-status-badge');
        if (status === 'Ativo') {
            statusBadge.innerText = '● Ativo';
            statusBadge.style.color = '#22c55e';
        } else {
            statusBadge.innerText = '● Rascunho';
            statusBadge.style.color = '#6b7280';
        }
    }

    // Manipulação do Upload de Arquivos de Imagem
    function handleFileSelect(event) {
        const files = Array.from(event.target.files);
        processFiles(files);
    }

    function processFiles(files) {
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImages.push(e.target.result);
                    renderPreviews();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Renderizar miniaturas e atualizar capa do card principal
    function renderPreviews() {
        const grid = document.getElementById('previews-grid');
        const previewContainer = document.getElementById('preview-image-container');

        grid.innerHTML = '';

        if (uploadedImages.length > 0) {
            // Imagem Principal na Pré-visualização
            previewContainer.innerHTML = `<img src="${uploadedImages[0]}" alt="Foto principal do produto">`;

            // Miniaturas
            uploadedImages.forEach((imgSrc, index) => {
                const container = document.createElement('div');
                container.className = 'preview-thumb-container';

                container.innerHTML = `
                    <img src="${imgSrc}" class="preview-thumb" alt="Thumb ${index}">
                    <button type="button" class="remove-thumb-btn" onclick="removeImage(${index})">✕</button>
                `;
                grid.appendChild(container);
            });
        } else {
            previewContainer.innerHTML = `
                <span style="font-size: 32px; color: #d67da3;">🧶</span>
                <span style="font-size: 12px; color: #a08899; margin-top: 6px;">Envie uma imagem para visualizar</span>
            `;
        }
    }

    // Remover foto carregada
    function removeImage(index) {
        uploadedImages.splice(index, 1);
        renderPreviews();
    }

    // Suporte a Drag and Drop no Dropzone
    const dropzone = document.getElementById('dropzone');

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
        }, false);
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = Array.from(dt.files);
        processFiles(files);
    });

    // Submissão do Formulário
    function handleProductSubmit(event) {
        event.preventDefault();
        showToast('✓ Produto publicado com sucesso no catálogo!');
    }

    function saveDraft() {
        document.getElementById('prod-status').value = 'Rascunho';
        updateLivePreview();
        showToast('💾 Produto salvo como rascunho!');
    }

    function resetForm() {
        document.getElementById('product-form').reset();
        uploadedImages = [];
        renderPreviews();
        toggleCustomDays();
        updateLivePreview();
        showToast('Formulário redefinido.');
    }

    // Notificação Toast Interativa
    function showToast(message) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-message').innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }