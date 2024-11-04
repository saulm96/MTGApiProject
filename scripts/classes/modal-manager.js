import { CollectionManager } from "./collection-manager.js";

export class ModalManager {
    constructor() {
        this.form = document.querySelector('.search-filter') || null;
        this.cardContainer = document.getElementById('card-container') || null;
        this.modalContainer = document.getElementById('modal-container');

        if (!this.modalContainer) {
            console.error('Error: No se encontró "modalContainer" en el DOM. Es necesario para mostrar los modales.');
            return;
        }

        this.collectionManager = new CollectionManager();
    }

    showFullCard(card) {
        this.clearModalContent();
        this.renderFullCardModal(card);
        this.setupModalButtons(card);
        this.toggleModalVisibility(true);
        this.disableScroll();
    }

    clearModalContent() {
        if (this.modalContainer) {
            this.modalContainer.innerHTML = '';
        }
    }

    renderFullCardModal(card) {
        const fullCard = card.renderFullCard();
        this.modalContainer.appendChild(fullCard);
    }

    setupModalButtons(card) {
        const closeButton = this.createCloseButton();
        const addToDeckButton = this.createAddToDeckButton(card);

        this.modalContainer.appendChild(closeButton);
        this.modalContainer.appendChild(addToDeckButton);

        closeButton.addEventListener('click', () => this.hideFullCard());
        addToDeckButton.addEventListener('click', () => this.showDeckModal(card));
    }

    createCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-modal');
        return closeButton;
    }

    createAddToDeckButton(card) {
        const addToDeckButton = document.createElement('button');
        addToDeckButton.classList.add('deck-modal-button');
        return addToDeckButton;
    }

    toggleModalVisibility(isVisible) {
        if (this.form) this.form.classList.toggle('hidden', isVisible);
        if (this.cardContainer) this.cardContainer.classList.toggle('hidden', isVisible);
        if (this.modalContainer) this.modalContainer.classList.toggle('active', isVisible);
    }

    hideFullCard() {
        this.toggleModalVisibility(false);
        if (this.modalContainer) {
            this.modalContainer.innerHTML = '';
        }
        this.enableScroll();
    }

    showDeckModal(card) {
        const existingModal = document.querySelector('.deck-modal');
        
        if (existingModal) {
            existingModal.remove();
        }

        const deckModal = this.collectionManager.createDeckModal(card);
        this.modalContainer.appendChild(deckModal);
    }

    disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    enableScroll() {
        document.body.style.overflow = '';
    }
}
