import {APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

import {buildResponse, failure, success} from "./helpers/response";


const {PRODUCTS_TABLE, STOCK_TABLE} = process.env
const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
    // const products: Products[] = JSON.parse(process.env.PRODUCTS || '[]');
    try {
        const productsResult = await dynamoDb.scan({TableName: PRODUCTS_TABLE || ''}).promise();
        const products = productsResult.Items;

        const stocksResult = await dynamoDb.scan({TableName: STOCK_TABLE || ''}).promise();
        const stocks = stocksResult.Items;

        if (!products || !stocks) {
            return buildResponse(404, {message: "Products or stocks not found"})
        }

        const productsWithStocks = products.map(product => {
            const stock = stocks.find(stock => stock.product_id === product.id);
            return {
                ...product,
                count: stock ? stock.count : 0
            }
        });

        return success(productsWithStocks)

    } catch (error) {
        console.error('Error retrieving products:', error);
        return failure({error: 'Failed to retrieve products'})
    }

};
