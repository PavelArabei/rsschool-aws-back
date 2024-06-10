import {handler} from '../lambda/getProductsById'; // Путь к вашему обработчику
import {APIGatewayProxyEvent} from 'aws-lambda';
import {Products} from "../types/products";


describe('getProductsById handler', () => {
    const mockProducts: Products[] = [
        {
            id: "1",
            title: "guitar",
            description: "The best guitar",
            price: 100
        }
    ]

    beforeEach(() => {
        process.env.PRODUCTS = JSON.stringify(mockProducts);
    });

    afterEach(() => {
        delete process.env.PRODUCTS;
    });


    it('should return 404 if product is not found', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                productId: 'someId'
            }
        } as any;

        const result = await handler(event, {} as any, {} as any);
        if (!result) return

        expect(result.statusCode).toBe(404);
        expect(result.body).toContain('Product not found');
    });

    it('should return 200 if product is found', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                productId: '1'
            }
        } as any;


        const result = await handler(event, {} as any, {} as any);
        if (!result) return

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockProducts[0]);
    });

    it('should return 403 if product is not exists', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                productId: '2'
            }
        } as any;


        const result = await handler(event, {} as any, {} as any);

        if (!result) return
        expect(result.statusCode).toBe(404);

    });
});
