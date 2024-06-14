import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

import {buildResponse, failure, success} from "./helpers/response";

const AWS = require('aws-sdk');

const {PRODUCTS_TABLE, STOCK_TABLE} = process.env
const dynamoDb: DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters?.productId;
    console.log('productId', productId)

    if (!productId) {
        return buildResponse(400, {message: "Product ID is required"})
    }

    const paramsForProducts = {
        TableName: PRODUCTS_TABLE!,
        Key: {
            id: productId
        }
    }

    const paramsForStocks = {
        TableName: STOCK_TABLE!,
        Key: {
            product_id: productId
        }
    }

    try {

        const product = await dynamoDb.get(paramsForProducts).promise();
        const stock = await dynamoDb.get(paramsForStocks).promise();

        if (!product || !stock) {
            console.error('Product or stocks not found');
            return buildResponse(404, {message: "Product or stock not found"})
        }

        const productWithStock = {
            ...product.Item,
            count: stock.Item?.count || 0
        }
        return success(productWithStock)

    } catch (error) {

        console.error('Error retrieving product:', error);
        return failure({error: 'Failed to retrieve product'})
    }

};
