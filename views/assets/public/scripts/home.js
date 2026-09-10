const favoriteButtons = document.querySelectorAll(".favorite-button");
const profileButton = document.querySelector("#profileIcon");


console.log("oi..");

async function fetchFAQs() {
    try {
        const response = await fetch("http://localhost/crochet/api/faqs/list");//não ta pegando por categoria :(
        const faqs = await response.json();
        const listFaqs = document.querySelector(".faq-section");
        
        // Remove itens antigos caso a função seja chamada mais de uma vez, mantendo apenas o h2
        const existingDetails = listFaqs.querySelectorAll("details");
        existingDetails.forEach(item => item.remove());

        faqs.data.forEach(faq => {
            const faqItem = document.createElement("details");
            faqItem.className = "faq-item";
            faqItem.innerHTML = `
                <summary>${faq.question}</summary>
                <p>${faq.answer}</p>
            `;
            listFaqs.append(faqItem);
        });
    } catch (error) {
        console.error("Erro ao carregar as FAQs:", error);
    }
}

fetchFAQs();




profileButton.addEventListener("click", () => {
    console.log("clicando");
    window.location.href = "account.html";
})

favoriteButtons.forEach((button) => {

    button.addEventListener("click", () => {

        if(button.textContent === "♡") {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});

const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("input", () => {

    console.log(searchInput.value);

});

const sortProducts = document.querySelector("#sort-products");

sortProducts.addEventListener("change", () => {

    console.log(sortProducts.value);

});
