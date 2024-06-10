import {APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {Products} from "../types/products";

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
    const products: Products[] = JSON.parse(process.env.PRODUCTS || '[]');

    return {
        statusCode: 200,
        body: JSON.stringify(products),
    };

};
