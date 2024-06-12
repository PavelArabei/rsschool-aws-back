import {APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {Products} from "../types/products";

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
    const products: Products[] = JSON.parse(process.env.PRODUCTS || '[]');

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: JSON.stringify(products),
    };

};
