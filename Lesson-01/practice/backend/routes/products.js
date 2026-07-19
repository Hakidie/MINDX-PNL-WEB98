import { products } from '../data.js';

function getProducts(request, response, searchParams) {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let result = products;

    if (minPrice !== null) {
        result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== null) {
        result = result.filter(p => p.price <= Number(maxPrice));
    }

    response.end(JSON.stringify(result));
}

export { getProducts }
