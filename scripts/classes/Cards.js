class Card {
    constructor(name, colors, image, types, subtypes, text, manacost, power, toughness, set) {
        this.name = name || 'No name available';
        this.colors = Array.isArray(colors) ? colors : ['No colors available'];
        this.image = image;
        this.types = Array.isArray(types) ? types : [];
        this.subtypes = Array.isArray(subtypes) ? subtypes : [];
        this.text = text || 'No text available';
        this.manacost = manacost || '';
        this.power = power || '';
        this.toughness = toughness || '';
        this.set = set || '';
    }

    // Método para renderizar solo la imagen
    renderPresentation() {
        const section = document.createElement('section');
        section.classList.add('card-image-box');
        
        const image = document.createElement('img');
        image.classList.add('card-img');
        image.src = this.image;
        
        if(this.image === './resources/no-pictures.png'){
            const cardName = document.createElement('p');
            cardName.classList.add('card-name');
            cardName.textContent = this.name;
            section.appendChild(cardName);

            const setName = document.createElement('p');
            setName.classList.add('set-name');
            setName.textContent = this.set;
            section.appendChild(setName);

        }
        section.appendChild(image);
        


        return section;
    }


    renderFullCard() {
        const section = document.createElement('section');
        section.classList.add('card-main-box');

        const name = document.createElement('h3');
        name.classList.add('card-name');
        name.textContent = this.name;


        const image = this.renderPresentation();
        //Change the class so it works propperly also in the modal
        image.classList.replace('card-image-box', 'modal-img')

        const types = document.createElement('p');
        types.classList.add('card-types');
        types.textContent = this.types.join(', ');

        const subtypes = document.createElement('p');
        subtypes.classList.add('card-subtype');
        subtypes.textContent = this.subtypes.join(', ');

        const text = document.createElement('p');
        text.classList.add('card-text');
        text.textContent = this.text;

        const manacost = document.createElement('p');
        manacost.classList.add('card-manacost');
        manacost.textContent = this.manacost;

        const power = document.createElement('p');
        power.classList.add('card-power');
        power.textContent = 'Power: ' + this.power;

        const toughness = document.createElement('p');
        toughness.classList.add('card-toughness');
        toughness.textContent = 'Toughness: ' + this.toughness;

        const set = document.createElement('p');
        set.classList.add('card-set');
        set.textContent = 'set: ' + this.set; 

        // Añadimos todos los elementos creados al contenedor principal
        section.append(name, image, types, subtypes, text, manacost, power, toughness, set);

        return section;
    }
}

export default Card;
