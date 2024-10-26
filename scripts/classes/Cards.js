
class Card {
    constructor(name, colors, image, types, subtypes, text, manacost, power, toughness, set) {
        this.name = name;
        this.colors = colors;
        this.image = image;
        this.types = types;
        this.subtypes = subtypes;
        this.text = text;
        this.manacost = manacost;
        this.power = power;
        this.toughness = toughness;
        this.set = set;
    }

    render() {
        const section = document.createElement('section');
        section.classList.add('card-main-box');

        const name = document.createElement('h3');
        name.classList.add('card-name');
        name.textContent = this.name;

        const image = document.createElement('img');
        image.classList.add('card-img');
        image.src = this.image;

        const colors = document.createElement('p');
        colors.classList.add('card-colors');
        colors.textContent = this.colors.join(', ');

        const types = document.createElement('p');
        types.classList.add('card-types');
        types.textContent = this.types.join(', ');

        const subtypes = document.createElement('p');
        subtypes.classList.add('card-subtype');
        subtypes.textContent = this.subtypes.join(', ');

        const text = document.createElement('p');
        text.classList.add('card-text');
        text.textContent = this.text;

        const manaCost = document.createElement('p');
        manaCost.classList.add('card-manacost');
        manaCost.textContent = this.manacost;

        const power = document.createElement('p');
        power.classList.add('card-power');
        power.textContent = this.power;

        const toughness = document.createElement('p');
        toughness.classList.add('card-power');
        toughness.textContent = this.toughness;

        const set = document.createElement('p');
        set.classList.add('card-set');
        set.textContent = this.set;

        section.append(name, colors, image, types, subtypes, text, manaCost, power, toughness, set);
    }
}
export default Card;