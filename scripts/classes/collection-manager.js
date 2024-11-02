export class CollectionManager {
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

        // Ahora añadimos los botones de colección al contenedor, no al modal
        this.addExistingCollectionButtons(collectionInputContainer, card);

        return newModal;
    }

    createNewCollectionButton(card, newModal) {
        const createCollectionButton = document.createElement('button');
        createCollectionButton.textContent = 'New Deck';
        createCollectionButton.classList.add('create-collection-button');
        
        createCollectionButton.addEventListener('click', () => {
            this.showNewCollectionInput(createCollectionButton, card);
        });

        return createCollectionButton;
    }

    showNewCollectionInput(createButton, card) {
        // Obtén el modal contenedor principal (deck-modal) en lugar de collectionInputContainer
        const deckModal = createButton.closest('.deck-modal');
        
        // Verifica si los elementos ya existen en el modal para evitar duplicados
        if (!deckModal.querySelector('.collection-input') && !deckModal.querySelector('.save-collection-button')) {
            // Crear y añadir los elementos directamente al modal
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

    // Modificada para añadir los botones al contenedor en lugar del modal
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