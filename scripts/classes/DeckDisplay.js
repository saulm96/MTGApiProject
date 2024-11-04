import Card from "./Cards.js";
import { ModalManager } from "./modal-manager.js";
import { CollectionManager } from "./collection-manager.js";

export class DeckDisplay {
    constructor() {
        // Get main DOM elements and initialize managers
        this.deckContainer = document.getElementById('deck-container');
        this.cardContainer = document.getElementById('card-container');
        this.modalManager = new ModalManager();
        this.collectionManager = new CollectionManager();
        this.mainContent = document.querySelector('.main-content');

        // Extend hideFullCard method to handle content visibility
        const originalHideFullCard = this.modalManager.hideFullCard.bind(this.modalManager);
        this.modalManager.hideFullCard = () => {
            originalHideFullCard();
            this.toggleMainContentVisibility(false);
        };
    }

    toggleMainContentVisibility(isModalOpen) {
        // Hide/show all main content except modal
        const mainContentChildren = Array.from(this.mainContent.children);
        mainContentChildren.forEach(child => {
            if (child.id !== 'modal-container') {
                child.style.display = isModalOpen ? 'none' : '';
            }
        });
    }

    displayDecks() {
        // Clear current display
        this.deckContainer.innerHTML = '';
        // Get all deck names from localStorage (excluding length property)
        const deckNames = Object.keys(localStorage).filter(key => key !== 'length');

        deckNames.forEach(deckName => {
            // Create container for deck and delete buttons
            const deckWrapper = document.createElement('div');
            deckWrapper.classList.add('deck-wrapper');

            // Create deck button
            const deckButton = document.createElement('button');
            deckButton.classList.add('deck-button');
            deckButton.textContent = deckName;
            deckButton.addEventListener('click', () => this.openDeckModal(deckName));

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-deck-button');
            // Stop event propagation to prevent opening deck when deleting
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                this.deleteDeck(deckName);
            });

            // Add buttons to wrapper and display
            deckWrapper.appendChild(deckButton);
            deckWrapper.appendChild(deleteButton);
            this.deckContainer.appendChild(deckWrapper);
        });
    }

    deleteDeck(deckName) {
        // Show confirmation dialog before deleting
        if (confirm(`Are you sure you want to remove "${deckName}" from the collection??`)) {
            localStorage.removeItem(deckName);
            // Refresh deck display after deletion
            this.displayDecks(); 
        }
    }

    removeDeckModalButton() {
        // Remove deck modal button if it exists
        const deckModalButton = document.querySelector('.deck-modal-button');
        if (deckModalButton) {
            deckModalButton.remove();
        }
    }

    openDeckModal(deckName) {
        // Get cards and prepare display
        const deckCards = this.getDeckCards(deckName);
        this.cardContainer.innerHTML = '';
        this.modalManager.clearModalContent();
        
        this.cardContainer.classList.remove('hidden');
        this.modalManager.modalContainer.classList.remove('active');

        // Create and display each card
        deckCards.forEach(cardData => {
            const card = this.createCardInstance(cardData);
            const cardElement = card.renderPresentation();
            this.cardContainer.appendChild(cardElement);

            // Add click handler for showing full card details
            cardElement.addEventListener('click', () => {
                this.modalManager.clearModalContent();
                this.modalManager.renderFullCardModal(card);
                this.modalManager.setupModalButtons(card);
                this.removeDeckModalButton();
                this.toggleMainContentVisibility(true);
                this.modalManager.modalContainer.classList = 'active';
                this.modalManager.disableScroll();
            });
        });
    }

    getDeckCards(deckName) {
        // Get deck from localStorage and parse it, return empty array if not found
        const deck = localStorage.getItem(deckName);
        return deck ? JSON.parse(deck) : [];
    }

    createCardInstance(cardData) {
        // Create new card instance with fallback for missing image
        return new Card(
            cardData.name,
            cardData.colors,
            cardData.image || './resources/no-pictures.png',
            cardData.types,
            cardData.subtypes,
            cardData.text,
            cardData.manaCost,
            cardData.power,
            cardData.toughness,
            cardData.set
        );
    }
}