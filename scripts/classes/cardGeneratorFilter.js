import { cardFilter } from "../apiCalls.js";
import Card from "./Cards.js";

export class FormProcessor {
    // Constructor initializes key DOM elements and sets up event listeners
    constructor() {
        this.initializeDOMElements();
        this.bindFormSubmitEvent();
    }

    // Collect references to important DOM elements
    initializeDOMElements() {
        this.form = document.querySelector('.search-filter');
        this.cardContainer = document.getElementById('card-container');
        this.modalContainer = document.getElementById('modal-container');
    }

    // Attach form submission event listener
    bindFormSubmitEvent() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchParams = this.extractSearchParameters();
            await this.renderSearchResults(searchParams);
        });
    }

    // Extract and sanitize form input parameters
    extractSearchParameters() {
        // Collect form input values
        const formData = {
            name: document.getElementById('card-name').value,
            power: document.getElementById('power').value.toString(),
            toughness: document.getElementById('toughness').value.toString(),
            colors: this.extractSelectedColors(),
            type: document.getElementById('type-selector').value,
            subtypes: document.getElementById('subtypes').value,
            rarity: document.getElementById('rarity-selector').value
        };

        // Remove empty or whitespace-only parameters
        return this.sanitizeSearchParameters(formData);
    }

    // Extract selected color checkboxes
    extractSelectedColors() {
        const colorCheckboxes = document.querySelectorAll('input[name="colors"]:checked');
        return Array.from(colorCheckboxes)
            .map(checkbox => checkbox.value)
            .join(',');
    }

    // Remove empty parameters from search form
    sanitizeSearchParameters(params) {
        return Object.fromEntries(
            Object.entries(params)
                .filter(([, value]) => value !== '' && value !== ' ')
        );
    }

    // Render search results with error and empty state handling
    async renderSearchResults(searchParams) {
        try {
            // Clear previous search results
            this.cardContainer.innerHTML = '';

            // Fetch and process cards
            const response = await cardFilter(searchParams);
            
            if (!response.cards || response.cards.length === 0) {
                this.displayNoResultsMessage();
                return;
            }

            // Render cards prioritizing those with images
            this.displayCardResults(response.cards);
        } catch (error) {
            this.displayErrorMessage(error);
        }
    }

    // Display "No results" message when search returns no cards
    displayNoResultsMessage() {
        const noResults = document.createElement('p');
        noResults.textContent = 'No cards found';
        noResults.classList.add('no-results');
        this.cardContainer.appendChild(noResults);
    }

    // Sort and render card results
    displayCardResults(cards) {
        const sortedCards = this.sortCardsByImageAvailability(cards);
        
        sortedCards.forEach(cardData => {
            const imageUrl = cardData.imageUrl || './resources/no-pictures.png';
            const card = this.createCardInstance(cardData, imageUrl);
            const cardElement = card.renderPresentation();
            
            this.cardContainer.appendChild(cardElement);
            this.attachCardClickListener(cardElement, card);
        });
    }

    // Sort cards to prioritize those with images
    sortCardsByImageAvailability(cards) {
        return cards.sort((a, b) => {
            if (a.imageUrl && !b.imageUrl) return -1;
            if (!a.imageUrl && b.imageUrl) return 1;
            return 0;
        });
    }

    // Create card instance with extracted data
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

    // Attach click listener to show full card details
    attachCardClickListener(cardElement, card) {
        cardElement.addEventListener('click', () => this.showFullCard(card));
    }

    // Display error message if card fetching fails
    displayErrorMessage(error) {
        console.error('Error displaying cards:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading cards';
        errorMessage.classList.add('error-message');
        this.cardContainer.appendChild(errorMessage);
    }

    // Show full card details in modal
    showFullCard(card) {
        this.clearModalContent();
        this.renderFullCardModal(card);
        this.setupModalButtons(card);
        this.toggleModalVisibility(true);
    }

    // Clear existing modal content
    clearModalContent() {
        this.modalContainer.innerHTML = '';
    }

    // Render full card details in modal
    renderFullCardModal(card) {
        const fullCard = card.renderFullCard();
        this.modalContainer.appendChild(fullCard);
    }

    // Set up close and add to deck buttons
    setupModalButtons(card) {
        const closeButton = this.createCloseButton();
        const addToDeckButton = this.createAddToDeckButton(card);

        this.modalContainer.appendChild(closeButton);
        this.modalContainer.appendChild(addToDeckButton);

        closeButton.addEventListener('click', () => this.hideFullCard());
        addToDeckButton.addEventListener('click', () => this.showDeckModal(card));
    }

    // Create close button for modal
    createCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.classList.add('close-modal');
        return closeButton;
    }

    // Create "Add to" button for deck options
    createAddToDeckButton(card) {
        const addToDeckButton = document.createElement('button');
        addToDeckButton.textContent = 'Add to:';
        addToDeckButton.classList.add('deck-modal-button');
        return addToDeckButton;
    }

    // Toggle modal and form visibility
    toggleModalVisibility(isVisible) {
        this.form.classList.toggle('hidden', isVisible);
        this.cardContainer.classList.toggle('hidden', isVisible);
        this.modalContainer.classList.toggle('active', isVisible);
    }

    // Hide full card modal
    hideFullCard() {
        this.toggleModalVisibility(false);
        this.modalContainer.innerHTML = '';
    }

    // Show deck modal for adding card to collections
    showDeckModal(card) {
        const existingModal = document.querySelector('.deck-modal');
        
        if (existingModal) {
            existingModal.remove();
            return;
        }

        const deckModal = this.createDeckModal(card);
        this.modalContainer.appendChild(deckModal);
    }

    // Create deck modal with collection options
    createDeckModal(card) {
        const newModal = document.createElement('div');
        newModal.classList.add('deck-modal');

        const title = document.createElement('h3');
        title.textContent = "Choose a collection or create a new one";
        newModal.appendChild(title);

        const createCollectionButton = this.createNewCollectionButton(card, newModal);
        newModal.appendChild(createCollectionButton);

        const collectionInputContainer = this.createCollectionInputContainer(card);
        newModal.appendChild(collectionInputContainer);

        this.addExistingCollectionButtons(newModal, card);

        return newModal;
    }

    // Create button to add new collection
    createNewCollectionButton(card, newModal) {
        const createCollectionButton = document.createElement('button');
        createCollectionButton.textContent = 'Create New Collection';
        createCollectionButton.classList.add('create-collection-button');
        
        createCollectionButton.addEventListener('click', () => {
            this.showNewCollectionInput(createCollectionButton, card);
        });

        return createCollectionButton;
    }

    // Show input for creating a new collection
    showNewCollectionInput(createButton, card) {
        const collectionInputContainer = createButton.nextElementSibling;
        
        if (!collectionInputContainer.hasChildNodes()) {
            const { collectionInput, saveCollectionButton } = this.createCollectionInputElements(card);
            collectionInputContainer.appendChild(collectionInput);
            collectionInputContainer.appendChild(saveCollectionButton);
        }
    }

    // Create input elements for new collection
    createCollectionInputElements(card) {
        const collectionInput = document.createElement('input');
        collectionInput.placeholder = 'Enter collection name';
        collectionInput.classList.add('collection-input');
        
        const saveCollectionButton = document.createElement('button');
        saveCollectionButton.textContent = 'Save Collection';
        saveCollectionButton.classList.add('save-collection-button');

        saveCollectionButton.addEventListener('click', () => {
            const collectionName = collectionInput.value.trim();
            
            if (collectionName) {
                this.createAndSaveCollection(collectionName, card);
            } else {
                alert("Please enter a collection name");
            }
        });

        return { collectionInput, saveCollectionButton };
    }

    // Create and save a new collection
    createAndSaveCollection(collectionName, card) {
        localStorage.setItem(collectionName, JSON.stringify([]));
        this.addCardToCollection(collectionName, card);
        this.showDeckModal(card);
    }

    // Create input container for collection input
    createCollectionInputContainer(card) {
        const collectionInputContainer = document.createElement('div');
        collectionInputContainer.classList.add('collection-input-container');
        return collectionInputContainer;
    }

    // Add buttons for existing collections
    addExistingCollectionButtons(newModal, card) {
        const collectionNames = Object.keys(localStorage);
        
        collectionNames.forEach(collectionName => {
            const collectionButton = this.createCollectionButton(collectionName, card);
            newModal.appendChild(collectionButton);
        });
    }

    // Create button for an existing collection
    createCollectionButton(collectionName, card) {
        const collectionButton = document.createElement('button');
        collectionButton.textContent = collectionName;
        collectionButton.classList.add('collection-button');

        collectionButton.addEventListener('click', () => {
            this.addCardToCollection(collectionName, card);
        });

        return collectionButton;
    }

    // Add card to a specific collection
    addCardToCollection(collectionName, card) {
        const collection = this.getCollection(collectionName);
        
        if (!this.isCardInCollection(collection, card)) {
            collection.push(card);
            this.saveCollection(collectionName, collection);
            alert(`Card added to collection: ${collectionName}`);
        } else {
            alert(`Card already exists in collection: ${collectionName}`);
        }
    }

    // Retrieve collection from localStorage
    getCollection(collectionName) {
        return JSON.parse(localStorage.getItem(collectionName)) || [];
    }

    // Check if card already exists in collection
    isCardInCollection(collection, card) {
        return collection.some(savedCard => savedCard.name === card.name);
    }

    // Save collection to localStorage
    saveCollection(collectionName, collection) {
        localStorage.setItem(collectionName, JSON.stringify(collection));
    }
}