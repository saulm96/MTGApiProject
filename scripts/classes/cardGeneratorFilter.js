import { cardFilter } from "../apiCalls.js";
import Card from "./Cards.js";

export class FormProcessor {
    constructor() {
        this.form = document.querySelector('.search-filter');
        this.cardContainer = document.getElementById('card-container');
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = this.processForm();
            await this.displayCards(formData);
        });
    }

    processForm() {

        const cardName = document.getElementById('card-name').value;

        const power = document.getElementById('power').value.toString();
        const toughness = document.getElementById('toughness').value.toString();

        const colorCheckboxes = document.querySelectorAll('input[name="colors"]:checked');
        const selectedColors = Array.from(colorCheckboxes).map(checkbox => checkbox.value);
        const selectedColorsArr = selectedColors.join(',');

        const type = document.getElementById('type-selector').value;
        const subtypes = document.getElementById('subtypes').value;

        const rarity = document.getElementById('rarity-selector').value;

        const formData = {
            name: cardName,
            power,
            toughness,
            colors: selectedColorsArr,
            type,
            subtypes,
            rarity,
        };
        
        //Delete empty values so we can mount the endpoints propperly
        Object.keys(formData).forEach(key => {
            if (formData[key] === '' || formData[key] === ' ') {
                delete formData[key];
            }
        });
        return formData;
    }

    async displayCards(params) {
        try {
            // Get API response
            const response = await cardFilter(params);
            // Clear the container before adding new cards
            this.cardContainer.innerHTML = '';

            // Check if we have cards in the response
            if (!response.cards || response.cards.length === 0) {
                const noResults = document.createElement('p');
                noResults.textContent = 'No cards found';
                noResults.classList.add('no-results');
                this.cardContainer.appendChild(noResults);
                return;
            }

            // Sort cards: cards with images first, then cards without images
            const sortedCards = response.cards.sort((a, b) => {
                if (a.imageUrl && !b.imageUrl) return -1;
                if (!a.imageUrl && b.imageUrl) return 1;
                return 0;
            });

            // Iterate through sorted cards and create card elements
            sortedCards.forEach(cardData => {
                // Check and fix image URL
               let imageUrl = cardData.imageUrl;
                if (!imageUrl) {
                    imageUrl = './resources/no-pictures.png'; 
                }
                
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
                this.cardContainer.appendChild(cardElement);
            });
        } catch (error) {
            console.error('Error displaying cards:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error loading cards';
            errorMessage.classList.add('error-message');
            this.cardContainer.appendChild(errorMessage);
        }
    }
}