import { cardFilter } from "../apiCalls.js";
import { CardRenderer } from "./card-renderer.js";
import { ModalManager } from "./modal-manager.js";

export class FormHandler {
    constructor() {
        const modalManager = new ModalManager();
        const cardRenderer = new CardRenderer(modalManager);
        
        this.cardRenderer = cardRenderer;
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreCards = true;
        this.lastSearchParams = null;
        
        this.initializeDOMElements();
        this.bindFormSubmitEvent();
        this.bindScrollEvent();
        this.createLoadingElement();
    }

    initializeDOMElements() {
        this.form = document.querySelector('.search-filter');
        this.cardContainer = document.getElementById('card-container');
    }


    createLoadingElement() {
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'loading-container';
        
        const loadingGif = document.createElement('img');
        loadingGif.src = './resources/loading.gif';
        loadingGif.alt = 'Loading...';
        loadingGif.className = 'loading-gif';
        
        this.loadingElement.appendChild(loadingGif);
    }

    showLoading(isNewSearch) {
        this.isLoading = true;
        if (isNewSearch) {
            this.cardContainer.innerHTML = '';
            this.loadingElement.classList.remove('scroll-loading');
        } else {
            this.loadingElement.classList.add('scroll-loading');
        }
        this.cardContainer.appendChild(this.loadingElement);
    }

    hideLoading() {
        this.isLoading = false;
        if (this.loadingElement.parentNode) {
            this.loadingElement.remove();
        }
    }
    bindScrollEvent() {
        window.addEventListener('scroll', () => {
            if (this.shouldLoadMoreCards()) {
                this.loadNextPage();
            }
        });
    }

    shouldLoadMoreCards() {
        if (this.isLoading || !this.hasMoreCards) return false;

        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        return (documentHeight - scrollPosition) < 200;
    }

    bindFormSubmitEvent() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.currentPage = 1;
            this.hasMoreCards = true;
            const searchParams = this.extractSearchParameters();
            this.lastSearchParams = searchParams;
            await this.renderSearchResults(searchParams, true);
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
            rarity: document.getElementById('rarity-selector').value,
            page: this.currentPage,
            
        };

        return this.sanitizeSearchParameters(formData);
    }

    async loadNextPage() {
        if (this.lastSearchParams && !this.isLoading && this.hasMoreCards) {
            this.currentPage++;
            const params = { ...this.lastSearchParams, page: this.currentPage };
            await this.renderSearchResults(params, false);
        }
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

    async renderSearchResults(searchParams, isNewSearch) {
        try {
            this.showLoading(isNewSearch);
            const response = await cardFilter(searchParams);
            
            if (!response.cards || response.cards.length === 0) {
                this.hasMoreCards = false;
                if (isNewSearch) {
                    this.displayNoResultsMessage();
                }
                return;
            }

            await this.cardRenderer.displayCardResults(response.cards, !isNewSearch);

            if (response.cards.length < 20) {
                this.hasMoreCards = false;
            }

        } catch (error) {
            this.displayErrorMessage(error);
        } finally {
            this.hideLoading();
        }
    }
    displayNoResultsMessage() {
        this.hideLoading();
        const noResults = document.createElement('p');
        noResults.textContent = 'No cards found';
        noResults.classList.add('no-results');
        this.cardContainer.appendChild(noResults);
    }

    displayErrorMessage(error) {
        this.hideLoading();
        console.error('Error displaying cards:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading cards';
        errorMessage.classList.add('error-message');
        this.cardContainer.appendChild(errorMessage);
    }
}