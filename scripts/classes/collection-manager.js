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

        this.addExistingCollectionButtons(newModal, card);

        return newModal;
    }

    createNewCollectionButton(card, newModal) {
        const createCollectionButton = document.createElement('button');
        createCollectionButton.textContent = 'New Collection';
        createCollectionButton.classList.add('create-collection-button');
        
        createCollectionButton.addEventListener('click', () => {
            this.showNewCollectionInput(createCollectionButton, card);
        });

        return createCollectionButton;
    }

    showNewCollectionInput(createButton, card) {
        const collectionInputContainer = createButton.nextElementSibling;
        
        if (!collectionInputContainer.hasChildNodes()) {
            const { collectionInput, saveCollectionButton } = this.createCollectionInputElements(card);
            collectionInputContainer.appendChild(collectionInput);
            collectionInputContainer.appendChild(saveCollectionButton);
        }
    }

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
                this.showDeckModal(card);
            } else {
                alert("Please enter a collection name");
            }
        });

        return { collectionInput, saveCollectionButton };
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

    createCollectionInputContainer() {
        const collectionInputContainer = document.createElement('div');
        collectionInputContainer.classList.add('collection-input-container');
        return collectionInputContainer;
    }

    addExistingCollectionButtons(newModal, card) {
        const collectionNames = Object.keys(localStorage)
            .filter(key => key !== 'length'); // Exclude localStorage internal keys
        
        collectionNames.forEach(collectionName => {
            const collectionButton = this.createCollectionButton(collectionName, card);
            newModal.appendChild(collectionButton);
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