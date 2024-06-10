import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {Products} from "../types/products";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters?.productId;
    const products: Products[] = JSON.parse(process.env.PRODUCTS || '[]');

    const product = products.find(p => p.id === productId);

    if (product) {
        return {
            statusCode: 200,
            body: JSON.stringify(product),
        };
    }

    return {
        statusCode: 404,
        body: JSON.stringify({message: "Product not found"}),
    };
};
