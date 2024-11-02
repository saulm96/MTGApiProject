import { CollectionManager } from "./collection-manager.js";

export class ModalManager {
    constructor() {
        this.form = document.querySelector('.search-filter');
        this.cardContainer = document.getElementById('card-container');
        this.modalContainer = document.getElementById('modal-container');
        this.collectionManager = new CollectionManager();
    }

    showFullCard(card) {
        this.clearModalContent();
        this.renderFullCardModal(card);
        this.setupModalButtons(card);
        this.toggleModalVisibility(true);
        this.disableScroll(); // Deshabilitar scroll al mostrar el modal
    }

    clearModalContent() {
        this.modalContainer.innerHTML = '';
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
        this.form.classList.toggle('hidden', isVisible);
        this.cardContainer.classList.toggle('hidden', isVisible);
        this.modalContainer.classList.toggle('active', isVisible);
    }

    hideFullCard() {
        this.toggleModalVisibility(false);
        this.modalContainer.innerHTML = '';
        this.enableScroll(); // Reactivar scroll al cerrar el modal
    }

    showDeckModal(card) {
        const existingModal = document.querySelector('.deck-modal');
        
        if (existingModal) {
            existingModal.remove();
        }

        const deckModal = this.collectionManager.createDeckModal(card);
        this.modalContainer.appendChild(deckModal);
    }

    // Nuevo método para deshabilitar el scroll
    disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    // Nuevo método para habilitar el scroll
    enableScroll() {
        document.body.style.overflow = '';
    }
}