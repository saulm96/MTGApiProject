const BASE_URL = 'https://api.magicthegathering.io/v1/';

async function fetchData(route, searchParams = {}) {
    try {
        const url = new URL(BASE_URL + route);
        for (const key of Object.keys(searchParams)) {
            url.searchParams.append(key, searchParams[key]);
        }
        const response = await fetch(url);
        //const responseData = await response.json();
        return response
    } catch (error) {
        console.error(error);
        return { error: error }
    }
}

async function cardFilter(params) {
    const filteredCards = await fetchData('cards', params);
    return filteredCards;
}
export {cardFilter}


