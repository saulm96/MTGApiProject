import Card from "./Cards.js";
import { ModalManager } from "./modal-manager.js";

export class CardRenderer {
    constructor(modalManager) {
        this.cardContainer = document.getElementById('card-container');
        this.modalManager = modalManager || new ModalManager();
    }
    displayCardResults(cards) {
        //Sort cards using a method
        const sortedCards = this.sortCardsByImageAvailability(cards);
        
        sortedCards.forEach(cardData => {
            const imageUrl = cardData.imageUrl || './resources/no-pictures.png';
            const card = this.createCardInstance(cardData, imageUrl);
            const cardElement = card.renderPresentation();
            
            this.cardContainer.appendChild(cardElement);
            this.attachCardClickListener(cardElement, card);
        });
    }
    //Function to sort cards based on wheter they have an image
    sortCardsByImageAvailability(cards) {
        return cards.sort((a, b) => {
            if (a.imageUrl && !b.imageUrl) return -1;
            if (!a.imageUrl && b.imageUrl) return 1;
            return 0;
        });
    }
    //Create a Card instance with the given data
    createCardInstance(cardData, imageUrl) {
        return new Card(
            cardData.name,
            cardData.colors,
            imageUrl,
            cardData.types,
            cardData.subtypes,
            cardData.text,
            cardData.manaCost,
            cardData.power,
            cardData.toughness,
            cardData.setName
        );
    }
    //Attach a click listener to show the full content of the card.
    attachCardClickListener(cardElement, card) {
        cardElement.addEventListener('click', () => this.modalManager.showFullCard(card));
    }
}