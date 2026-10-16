import FaqService from "../../_common/classes/FaqService.js";

const faqService = new FaqService();


const favoriteButtons = document.querySelectorAll(".favorite-button");
const profileButton = document.querySelector("#profileIcon");


//console.log("oi..");

async function fetchFAQs() {
    try {
        const result = await faqService.list();
        const listFaqs = document.querySelector(".faq-section");

        listFaqs.querySelectorAll("details").forEach(item => item.remove());

        result.data.forEach(faq => {
            const item = document.createElement("details");
            item.className = "faq-item";

            const question = document.createElement("summary");
            question.textContent = faq.question;

            const answer = document.createElement("p");
            answer.textContent = faq.answer;

            item.append(question, answer);
            listFaqs.append(item);
        });
    } catch (error) {
        console.error("Erro ao carregar FAQs:", error);
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
