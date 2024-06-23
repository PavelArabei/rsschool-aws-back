import {handler} from '../lambda/getProductsList'; // Путь к вашему обработчику
import {Products} from "../types/products";


describe('getProductsById handler', () => {
    const mockProducts: Products[] = [
        {
            id: "1",
            title: "guitar",
            description: "The best guitar",
            price: 100
        }, {
            id: "2",
            title: "piano",
            description: "The best piano",
            price: 200

        },
    ]

    beforeEach(() => {
        process.env.PRODUCTS = JSON.stringify(mockProducts);
    });

    afterEach(() => {
        delete process.env.PRODUCTS;
    });


    it('should return an empty array if no products are available', async () => {
        process.env.PRODUCTS = JSON.stringify([]);
        const result = await handler({} as any, {} as any, {} as any);
        if (!result) return

        const body = JSON.parse(result.body);

        expect(result.statusCode).toBe(200);
        expect(body).toEqual([]);
    });

    it('should return a list of products', async () => {
        const result = await handler({} as any, {} as any, {} as any);
        if (!result) return

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockProducts);
    });

});
