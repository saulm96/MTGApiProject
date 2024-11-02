import { cardFilter } from "../apiCalls.js";
import { CardRenderer } from "./card-renderer.js";
import { ModalManager } from "./modal-manager.js";

export class FormHandler {
    constructor() {
        const modalManager = new ModalManager();
        const cardRenderer = new CardRenderer(modalManager);
        
        this.cardRenderer = cardRenderer;
        this.initializeDOMElements();
        this.bindFormSubmitEvent();
    }

    initializeDOMElements() {
        this.form = document.querySelector('.search-filter');
        this.cardContainer = document.getElementById('card-container');
    }

    bindFormSubmitEvent() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchParams = this.extractSearchParameters();
            await this.renderSearchResults(searchParams);
        });
    }

    extractSearchParameters() {
        const formData = {
            name: document.getElementById('card-name').value,
            power: document.getElementById('power').value.toString(),
            toughness: document.getElementById('toughness').value.toString(),
            colors: this.extractSelectedColors(),
            type: document.getElementById('type-selector').value,
            subtypes: document.getElementById('subtypes').value,
            rarity: document.getElementById('rarity-selector').value
        };

        return this.sanitizeSearchParameters(formData);
    }

    extractSelectedColors() {
        const colorCheckboxes = document.querySelectorAll('input[name="colors"]:checked');
        return Array.from(colorCheckboxes)
            .map(checkbox => checkbox.value)
            .join(',');
    }

    sanitizeSearchParameters(params) {
        return Object.fromEntries(
            Object.entries(params)
                .filter(([, value]) => value !== '' && value !== ' ')
        );
    }

    async renderSearchResults(searchParams) {
        try {
            this.cardContainer.innerHTML = '';
            const response = await cardFilter(searchParams);
            
            if (!response.cards || response.cards.length === 0) {
                this.displayNoResultsMessage();
                return;
            }

            this.cardRenderer.displayCardResults(response.cards);
        } catch (error) {
            this.displayErrorMessage(error);
        }
    }

    displayNoResultsMessage() {
        const noResults = document.createElement('p');
        noResults.textContent = 'No cards found';
        noResults.classList.add('no-results');
        this.cardContainer.appendChild(noResults);
    }

    displayErrorMessage(error) {
        console.error('Error displaying cards:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading cards';
        errorMessage.classList.add('error-message');
        this.cardContainer.appendChild(errorMessage);
    }
}