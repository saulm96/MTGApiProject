export class CollectionManager {
    createDeckModal(card) {
        //Create a modal to choose a collection or create a new one
        const newModal = document.createElement('div');
        newModal.classList.add('deck-modal');

        //Tittle
        const title = document.createElement('h3');
        title.textContent = "Choose a collection or create a new one";

        newModal.appendChild(title);
        //New collection
        const createCollectionButton = this.createNewCollectionButton(card, newModal);
        newModal.appendChild(createCollectionButton);

        //Container for existing selection or creating a new one
        const collectionInputContainer = this.createCollectionInputContainer(card);
        newModal.appendChild(collectionInputContainer);

        //Add buttons for existing collections based on localStorage data
        this.addExistingCollectionButtons(collectionInputContainer, card);

        return newModal;
    }

    createNewCollectionButton(card, newModal) {
        //Button to create a new collection
        const createCollectionButton = document.createElement('button');
        createCollectionButton.textContent = 'New Deck';
        createCollectionButton.classList.add('create-collection-button');
        //Event listener to show input for a new collection name
        createCollectionButton.addEventListener('click', () => {
            this.showNewCollectionInput(createCollectionButton, card);
        });

        return createCollectionButton;
    }

    showNewCollectionInput(createButton, card) {
        const deckModal = createButton.closest('.deck-modal');
        //Check if input and save button already exist to avoid duplicates
        if (!deckModal.querySelector('.collection-input') && !deckModal.querySelector('.save-collection-button')) {
            const { collectionInput, saveCollectionButton } = this.createCollectionInputElements(card);
            deckModal.appendChild(collectionInput);
            deckModal.appendChild(saveCollectionButton);
        }
    }

    createCollectionInputElements(card) {
        const collectionInput = document.createElement('input');
        collectionInput.placeholder = 'Enter collection name';
        collectionInput.classList.add('collection-input');
        
        const saveCollectionButton = document.createElement('button');
        saveCollectionButton.textContent = 'Save';
        saveCollectionButton.classList.add('save-collection-button');

        saveCollectionButton.addEventListener('click', () => {
            const collectionName = collectionInput.value.trim();
            
            if (collectionName) {
                this.createAndSaveCollection(collectionName, card);
                this.showDeckModal(card);
            } else {
                alert("Please enter a collection name");
            }
        });

        return { collectionInput, saveCollectionButton };
    }

    createCollectionInputContainer() {
        const collectionInputContainer = document.createElement('div');
        collectionInputContainer.classList.add('collection-input-container');
        return collectionInputContainer;
    }

    addExistingCollectionButtons(container, card) {
        const collectionNames = Object.keys(localStorage)
            .filter(key => key !== 'length');
        
        collectionNames.forEach(collectionName => {
            const collectionButton = this.createCollectionButton(collectionName, card);
            container.appendChild(collectionButton);
        });
    }

    createCollectionButton(collectionName, card) {
        const collectionButton = document.createElement('button');
        collectionButton.textContent = collectionName;
        collectionButton.classList.add('collection-button');

        collectionButton.addEventListener('click', () => {
            this.addCardToCollection(collectionName, card);
        });

        return collectionButton;
    }

    createAndSaveCollection(collectionName, card) {
        const existingCollection = this.getCollection(collectionName);
        if (existingCollection.some(savedCard => savedCard.name === card.name)) {
            alert(`Card already exists in collection: ${collectionName}`);
            return;
        }

        const updatedCollection = [...existingCollection, card];
        localStorage.setItem(collectionName, JSON.stringify(updatedCollection));
        alert(`Card added to collection: ${collectionName}`);
    }

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

    getCollection(collectionName) {
        return JSON.parse(localStorage.getItem(collectionName)) || [];
    }

    isCardInCollection(collection, card) {
        return collection.some(savedCard => savedCard.name === card.name);
    }

    saveCollection(collectionName, collection) {
        localStorage.setItem(collectionName, JSON.stringify(collection));
    }

    showDeckModal(card) {
        const existingModal = document.querySelector('.deck-modal');
        if (existingModal) {
            existingModal.remove();
        }
    }
}