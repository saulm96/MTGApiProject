import { CollectionManager } from "./collection-manager.js";

export class ModalManager {
    constructor() {
        // Reference form, card container, and modal container in the DOM
        this.form = document.querySelector('.search-filter') || null;
        this.cardContainer = document.getElementById('card-container') || null;
        this.modalContainer = document.getElementById('modal-container');

        // If modalContainer is not found, log an error and stop execution
        if (!this.modalContainer) {
            console.error('Error: "modalContainer" was not found in the DOM. It is required to display modals.');
            return;
        }

        // Initialize collection manager
        this.collectionManager = new CollectionManager();
    }

    showFullCard(card) {
        // Show full card modal, clearing and updating its content
        this.clearModalContent();
        this.renderFullCardModal(card);
        this.setupModalButtons(card);
        this.toggleModalVisibility(true);
        this.disableScroll();
    }

    clearModalContent() {
        // Clear the modal container content
        if (this.modalContainer) {
            this.modalContainer.innerHTML = '';
        }
    }

    renderFullCardModal(card) {
        // Render the full card view and append it to the modal container
        const fullCard = card.renderFullCard();
        this.modalContainer.appendChild(fullCard);
    }

    setupModalButtons(card) {
        // Set up modal close and "add to deck" buttons, appending them to the modal
        const closeButton = this.createCloseButton();
        const addToDeckButton = this.createAddToDeckButton(card);

        this.modalContainer.appendChild(closeButton);
        this.modalContainer.appendChild(addToDeckButton);

        // Attach event listeners to the buttons
        closeButton.addEventListener('click', () => this.hideFullCard());
        addToDeckButton.addEventListener('click', () => this.showDeckModal(card));
    }

    createCloseButton() {
        // Create and return a button to close the modal
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-modal');
        return closeButton;
    }

    createAddToDeckButton(card) {
        // Create and return a button to add the card to a deck
        const addToDeckButton = document.createElement('button');
        addToDeckButton.classList.add('deck-modal-button');
        return addToDeckButton;
    }

    toggleModalVisibility(isVisible) {
        // Toggle visibility of the modal and other content based on the modal state
        if (this.form) this.form.classList.toggle('hidden', isVisible);
        if (this.cardContainer) this.cardContainer.classList.toggle('hidden', isVisible);
        if (this.modalContainer) this.modalContainer.classList.toggle('active', isVisible);
    }

    hideFullCard() {
        // Hide the full card modal and re-enable scrolling
        this.toggleModalVisibility(false);
        if (this.modalContainer) {
            this.modalContainer.innerHTML = '';
        }
        this.enableScroll();
    }

    showDeckModal(card) {
        // Display the "add to deck" modal for the card, removing any existing modal first
        const existingModal = document.querySelector('.deck-modal');
        
        if (existingModal) {
            existingModal.remove();
        }

        // Create and append the deck modal from the collection manager
        const deckModal = this.collectionManager.createDeckModal(card);
        this.modalContainer.appendChild(deckModal);
    }

    disableScroll() {
        // Disable page scrolling while modal is active
        document.body.style.overflow = 'hidden';
    }

    enableScroll() {
        // Re-enable page scrolling after modal is closed
        document.body.style.overflow = '';
    }
}
