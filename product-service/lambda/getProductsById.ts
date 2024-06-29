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
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': productId,
        },
    }

    const paramsForStocks = {
        TableName: STOCK_TABLE!,
        KeyConditionExpression: 'product_id = :product_id',
        ExpressionAttributeValues: {
            ':product_id': productId,
        },
    }

    try {
        const [productResult, stockResult] = await Promise.all([
            dynamoDb.query(paramsForProducts).promise(),
            dynamoDb.query(paramsForStocks).promise()
        ]);

        if (!productResult.Items?.length || !stockResult.Items?.length) {
            console.error('Product or stocks not found');
            return buildResponse(404, {message: "Product or stock not found"})
        }

        const product = productResult.Items[0];
        const stock = stockResult.Items[0];

        const productWithStock = {
            ...product,
            count: stock.count
        }
        return success(productWithStock)

    } catch (error: any) {
        console.error('Error retrieving product:', error);
        return failure({error: 'Failed to retrieve product: ' + error.message})
    }
};
