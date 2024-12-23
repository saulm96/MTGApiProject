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
        if (confirm(`Are you sure you want to remove "${deckName}" from the collection?`)) {
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

        // Show modal and clear previous content
        this.cardContainer.classList.remove('hidden');
        this.modalManager.modalContainer.classList.remove('active');

        // Create and display each card
        deckCards.forEach(cardData => {
            const card = this.createCardInstance(cardData);
            const cardElement = card.renderPresentation();

            // Ensure the image is fully loaded before displaying
            const img = cardElement.querySelector('img');
            if (img) {
                img.onload = () => {
                    // Append delete button to the card element
                    const deleteCardButton = document.createElement('button');
                    deleteCardButton.classList.add('delete-card-button');
                    deleteCardButton.style.backgroundImage = 'url(./resources/delete.png)';
                    deleteCardButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteCardFromDeck(deckName, cardData);
                    });
                    cardElement.appendChild(deleteCardButton);

                    // Add click handler for showing full card details
                    cardElement.addEventListener('click', () => {
                        this.modalManager.clearModalContent();
                        this.modalManager.renderFullCardModal(card);
                        this.modalManager.setupModalButtons(card);
                        this.removeDeckModalButton();
                        this.toggleMainContentVisibility(true);
                        this.modalManager.modalContainer.classList.add('active');
                        this.modalManager.disableScroll();
                    });

                    // Only add cardElement after the image has fully loaded
                    this.cardContainer.appendChild(cardElement);
                };
            } else {
                // If no image, append immediately
                this.cardContainer.appendChild(cardElement);
            }
        });
    }

    deleteCardFromDeck(deckName, cardData) {
        // Save the current scroll position of the card container
        const currentScrollPosition = this.cardContainer.scrollTop;

        // Retrieve the deck from localStorage and filter out the card to delete
        const deck = this.getDeckCards(deckName);
        const updatedDeck = deck.filter(card => card.name !== cardData.name);

        // Update localStorage with the modified deck without the deleted card
        localStorage.setItem(deckName, JSON.stringify(updatedDeck));

        // Clear the card container and update it with the remaining cards
        this.cardContainer.innerHTML = ''; // Empty the card container
        updatedDeck.forEach(card => {
            const cardInstance = this.createCardInstance(card);
            const cardElement = cardInstance.renderPresentation();

            // Set up the delete button for each card
            const deleteCardButton = document.createElement('button');
            deleteCardButton.classList.add('delete-card-button');
            deleteCardButton.style.backgroundImage = 'url(./resources/delete.png)';
            deleteCardButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCardFromDeck(deckName, card);
            });
            cardElement.appendChild(deleteCardButton);

            // Set up the event to show the full details of the card
            cardElement.addEventListener('click', () => {
                this.modalManager.clearModalContent();
                this.modalManager.renderFullCardModal(cardInstance);
                this.modalManager.setupModalButtons(cardInstance);
                this.removeDeckModalButton();
                this.toggleMainContentVisibility(true);
                this.modalManager.modalContainer.classList.add('active');
                this.modalManager.disableScroll();
            });

            // Add the card to the container
            this.cardContainer.appendChild(cardElement);
        });

        // Restore the scroll position of the card container
        this.cardContainer.scrollTop = currentScrollPosition;
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
