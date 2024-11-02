import { FormHandler } from './classes/form-handler.js';
import { ModalManager } from './classes/modal-manager.js';
import { CardRenderer } from './classes/card-renderer.js';
import { CollectionManager } from './classes/collection-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    const modalManager = new ModalManager();
    const cardRenderer = new CardRenderer(modalManager);
    const formHandler = new FormHandler();
    const collectionManager = new CollectionManager();

});