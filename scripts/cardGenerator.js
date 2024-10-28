import { cardFilter } from "./apiCalls.js";
import Card from "./classes/Cards.js";

const cardContainer = document.getElementById('card-container');

async function displayCards(params) {
    try {
        // Get API response
        const response = await cardFilter(params);
        // Clear the container before adding new cards
        cardContainer.innerHTML = '';

        // Check if we have cards in the response
        if (!response.cards || response.cards.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = 'No cards found';
            noResults.classList.add('no-results');
            cardContainer.appendChild(noResults);
            return;
        }

        // Sort cards: cards with images first, then cards without images
        const sortedCards = response.cards.sort((a, b) => {
            if (a.imageUrl && !b.imageUrl) return -1; // a goes first
            if (!a.imageUrl && b.imageUrl) return 1;  // b goes first
            return 0;
        });

        // Iterate through sorted cards and create card elements
        sortedCards.forEach(cardData => {
            // Check and fix image URL
            let imageUrl = cardData.imageUrl;
            if (!imageUrl) {
                // You can use a default image of your choice
                imageUrl = './resources/no-pictures.png';
            }

            // Create new card instance with data
            const card = new Card(
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

            // Add rendered card to container
            const cardElement = card.renderPresentation();
            cardContainer.appendChild(cardElement);
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error displaying cards:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading cards';
        errorMessage.classList.add('error-message');
        cardContainer.appendChild(errorMessage);
    }
}

const params = {
    name: 'atraxa'
}
/*displayCards(params)*/