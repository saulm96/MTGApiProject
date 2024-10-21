const BASE_URL = 'https://api.magicthegathering.io/v1/';

async function fetchCards(cardName) {
    try {
        const response = await fetch(`${BASE_URL}cards?name=${cardName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.cards); // Muestra las cartas en consola
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchCards();