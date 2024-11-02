const BASE_URL = 'https://api.magicthegathering.io/v1/';


async function fetchData(route, searchParams = {}) {
    try {
        const url = new URL(BASE_URL + route);

        for (const key of Object.keys(searchParams)) {
            url.searchParams.append(key, searchParams[key]);
        }

        const response = await fetch(url);
        //Made for counting all the cards given by the api
        const totalCount = response.headers.get('Total-Count')
        totalCount ? console.log(`Total de cartas: ${totalCount}`):
        console.log("No se encontró el header 'Total-Count'.");

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error(error);
        return { error: error }
    }
}

async function cardFilter(params) {
    const filteredCards = await fetchData('cards?pageSize=36', params);
    return filteredCards;
}

async function imageCardOnly(params){
 const cardsWithImageURL = await fetchData('cards?contain=imageURL',params)
 console.log(params)
 return cardsWithImageURL;
}
export{cardFilter,
    imageCardOnly,
}