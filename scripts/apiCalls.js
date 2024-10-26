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

async function cardFilter(params) {
    const filteredCards = await fetchData('cards', params);
    console.log(filteredCards)
    return filteredCards;
}

export {cardFilter}