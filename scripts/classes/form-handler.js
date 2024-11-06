import { cardFilter } from "../apiCalls.js";
import { CardRenderer } from "./card-renderer.js";
import { ModalManager } from "./modal-manager.js";

export class FormHandler {
    constructor() {
        // Initialize modal and card renderers
        const modalManager = new ModalManager();
        const cardRenderer = new CardRenderer(modalManager);
        
        this.cardRenderer = cardRenderer;
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreCards = true;
        this.lastSearchParams = null;
        
        // Initialize and bind DOM elements and events
        this.initializeDOMElements();
        this.bindFormSubmitEvent();
        this.bindScrollEvent();
        this.createLoadingElement();
    }

    initializeDOMElements() {
        // Select form and card container from the DOM
        this.form = document.querySelector('.search-filter');
        this.cardContainer = document.getElementById('card-container');
    }

    createLoadingElement() {
        // Create a loading element to display while loading cards
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'loading-container';
        
        const loadingGif = document.createElement('img');
        loadingGif.src = './resources/loading.gif';
        loadingGif.alt = 'Loading...';
        loadingGif.className = 'loading-gif';
        
        this.loadingElement.appendChild(loadingGif);
    }

    showLoading(isNewSearch) {
        // Show loading element, clearing previous results if it's a new search
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
        // Remove loading element when loading is complete
        this.isLoading = false;
        if (this.loadingElement.parentNode) {
            this.loadingElement.remove();
        }
    }

    bindScrollEvent() {
        // Bind scroll event to load more cards when nearing the end of the page
        window.addEventListener('scroll', () => {
            if (this.shouldLoadMoreCards()) {
                this.loadNextPage();
            }
        });
    }

    shouldLoadMoreCards() {
        // Check if additional cards should load based on scroll position
        if (this.isLoading || !this.hasMoreCards) return false;

        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        return (documentHeight - scrollPosition) < 200;
    }

    bindFormSubmitEvent() {
        // Bind form submission event to initiate search and reset page counter
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
        // Extract parameters from the form for the search request
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
        // Load the next page of results if not currently loading and more cards are available
        if (this.lastSearchParams && !this.isLoading && this.hasMoreCards) {
            this.currentPage++;
            const params = { ...this.lastSearchParams, page: this.currentPage };
            await this.renderSearchResults(params, false);
        }
    }

    extractSelectedColors() {
        // Get selected color filters from checkboxes in the form
        const colorCheckboxes = document.querySelectorAll('input[name="colors"]:checked');
        return Array.from(colorCheckboxes)
            .map(checkbox => checkbox.value)
            .join(',');
    }

    sanitizeSearchParameters(params) {
        // Clean up search parameters by removing empty fields
        return Object.fromEntries(
            Object.entries(params)
                .filter(([, value]) => value !== '' && value !== ' ')
        );
    }

    async renderSearchResults(searchParams, isNewSearch) {
        // Render card search results based on provided parameters
        try {
            this.showLoading(isNewSearch);
            const response = await cardFilter(searchParams);
            
            // Handle cases with no results found
            if (!response.cards || response.cards.length === 0) {
                this.hasMoreCards = false;
                if (isNewSearch) {
                    this.displayNoResultsMessage();
                }
                return;
            }

            await this.cardRenderer.displayCardResults(response.cards, !isNewSearch);

            // Check if fewer than expected results are returned
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
        // Show a message indicating no cards were found
        this.hideLoading();
        const noResults = document.createElement('p');
        noResults.textContent = 'No cards found';
        noResults.classList.add('no-results');
        this.cardContainer.appendChild(noResults);
    }

    displayErrorMessage(error) {
        // Show an error message if there is an issue loading cards
        this.hideLoading();
        console.error('Error displaying cards:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading cards';
        errorMessage.classList.add('error-message');
        this.cardContainer.appendChild(errorMessage);
    }
}
