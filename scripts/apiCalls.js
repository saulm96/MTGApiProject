const BASE_URL = 'https://api.magicthegathering.io/v1/';

async function fetchData(route, searchParams = {}) {
    try {
        const url = new URL(BASE_URL + route);
        for (const key of Object.keys(searchParams)) {
            url.searchParams.append(key, searchParams[key]);
        }
        const response = await fetch(url);
        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.error(error);
        return { error: error }
    }
}

async function getAllTypes() {
    const allTypes = await fetchData('types');
    console.log(allTypes);
    return allTypes;
}

async function cardFilter(params) {
    // Aquí ya no necesitas toString() porque fetchData maneja los parámetros
    const filteredCards = await fetchData('cards', params);
    console.log(filteredCards);
    return filteredCards;
}
const params = {
    rarity: 'Uncommon',
    power:'2',
    toughness:'2',
    set: 'SIR'
};
cardFilter(params);