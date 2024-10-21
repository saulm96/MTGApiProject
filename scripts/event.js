class Event{
    constructor (name, type, manaCost, rarity, setName, text, image){
        this.name = name;
        this.image = image;
        this.type = type;
        this.rarity = rarity;
        this.setName = setName;
        this.text = text;
        this.manaCost = manaCost;
    }
    render(){
        const tittle = document.createElement('h2');
        tittle.classList.add('cardName');
        tittle.innerText = this.name;

        const image = document.createElement('img');
        image.classList.add('cardIMG');
        image.src.add(this.image);
    

        const cardType = document.createElement('p')
        cardType.classList.add('cardType');

        const cardRarity = document.createElement('p');
        cardRarity.classList.add('cardRarity');
        
        const setName = document.createElement('p')
        setName.classList.add('setName');

        const description = document.createElement('p');
        description.classList.add('cardDescription');

        const manaCostInfo = document.createElement('p');
        manaCostInfo.classList.add('manaCost');

        
    }
}