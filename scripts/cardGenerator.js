import { cardFilter } from "./apiCalls.js";
import Card from "./classes/Cards.js";

async function createCard(param) {
    const cardSection = document.getElementById('card-container');
    const cardsData = await cardFilter(param);

    cardsData.cards.forEach(card => {
        const shownCard = new Card(card.name, card.image)
        cardSection.appendChild(shownCard.render());
    });
}

const data = {
    name: 'Black Lotus'
};

createCard(data);