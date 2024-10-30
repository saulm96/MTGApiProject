import { cardFilter } from "../apiCalls.js";
import Card from "./Cards.js";

export class FormProcessor {
    constructor() {
        // Ensure DOM elements are loaded before initializing properties
        this.form = document.querySelector('.search-filter');  // Form element
        this.cardContainer = document.getElementById('card-container');  // Card container element
        this.modalContainer = document.getElementById('modal-container');  // Modal container for full card view
        this.bindEvents();  // Call method to set up event listeners
    }

    bindEvents() {
        // Handle form submission to search and display cards
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();  // Prevent page reload on form submit
            const formData = this.processForm();  // Process form data
            await this.displayCards(formData);  // Display cards based on search criteria
        });
    }

    processForm() {
        const cardName = document.getElementById('card-name').value;
        const power = document.getElementById('power').value.toString();
        const toughness = document.getElementById('toughness').value.toString();
        const colorCheckboxes = document.querySelectorAll('input[name="colors"]:checked');
        const selectedColors = Array.from(colorCheckboxes).map(checkbox => checkbox.value).join(',');
        const type = document.getElementById('type-selector').value;
        const subtypes = document.getElementById('subtypes').value;
        const rarity = document.getElementById('rarity-selector').value;

        const formData = { name: cardName, power, toughness, colors: selectedColors, type, subtypes, rarity };

        // Delete empty values to properly construct the API endpoint
        Object.keys(formData).forEach(key => {
            if (formData[key] === '' || formData[key] === ' ') {
                delete formData[key];
            }
        });
        return formData;
    }

    async displayCards(params) {
        try {
            const response = await cardFilter(params);  // Fetch cards from API based on form data
            this.cardContainer.innerHTML = '';  // Clear previous cards

            if (!response.cards || response.cards.length === 0) {
                const noResults = document.createElement('p');
                noResults.textContent = 'No cards found';
                noResults.classList.add('no-results');
                this.cardContainer.appendChild(noResults);
                return;
            }

            const sortedCards = response.cards.sort((a, b) => {
                if (a.imageUrl && !b.imageUrl) return -1;
                if (!a.imageUrl && b.imageUrl) return 1;
                return 0;
            });

            sortedCards.forEach(cardData => {
                let imageUrl = cardData.imageUrl || './resources/no-pictures.png';

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

                const cardElement = card.renderPresentation();
                this.cardContainer.appendChild(cardElement);

                cardElement.addEventListener('click', () => {
                    this.showFullCard(card);
                });
            });
        } catch (error) {
            console.error('Error displaying cards:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error loading cards';
            errorMessage.classList.add('error-message');
            this.cardContainer.appendChild(errorMessage);
        }
    }

    // Method to display the full card view in a modal
    showFullCard(card) {
        // Clear previous modal content and add the new full card view
        this.modalContainer.innerHTML = '';
        const fullCard = card.renderFullCard();
        this.modalContainer.appendChild(fullCard);

        // Create a close button inside the modal
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.classList.add('close-modal');  // You can style this button with CSS
        this.modalContainer.appendChild(closeButton);

        // Hide form and card container to focus on the modal view
        this.form.classList.add('hidden');
        this.cardContainer.classList.add('hidden');
        
        // Show the modal by adding the 'active' class
        this.modalContainer.classList.add('active');

        // Add event listener to the close button to hide the modal when clicked
        closeButton.addEventListener('click', () => this.hideFullCard());
    }

    // Method to close the modal and restore the main view
    hideFullCard() {
        // Hide the modal by removing the 'active' class
        this.modalContainer.classList.remove('active');
        // Restore the form and card container visibility by removing the 'hidden' class
        this.form.classList.remove('hidden');
        this.cardContainer.classList.remove('hidden');
        
        // Clear the modal content to remove the card and close button
        this.modalContainer.innerHTML = '';
    }
}
