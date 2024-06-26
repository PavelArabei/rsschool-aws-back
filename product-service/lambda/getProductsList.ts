import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

import {buildResponse, failure, success} from "./helpers/response";

const AWS = require('aws-sdk');

const {PRODUCTS_TABLE, STOCK_TABLE} = process.env
const dynamoDb: DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('pathParameters', event.pathParameters)
    try {

        const [productsResult, stocksResult] = await Promise.all([
            dynamoDb.scan({TableName: PRODUCTS_TABLE!}).promise(),
            dynamoDb.scan({TableName: STOCK_TABLE!}).promise()
        ])

        const products = productsResult.Items;
        const stocks = stocksResult.Items;

        if (!products || !stocks) {
            console.error('Products or stocks not found');
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
