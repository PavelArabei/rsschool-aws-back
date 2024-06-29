import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

import {buildResponse, failure} from "./helpers/response";
import {ProductWithoutId} from "../types/products";

const {uuid} = require('uuidv4');
const AWS = require('aws-sdk');

const {PRODUCTS_TABLE, STOCK_TABLE} = process.env
const dynamoDb: DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const body = JSON.parse(event.body!) as ProductWithoutId
    console.log('productId', body)

    const {title, description, price, count} = body

    if (!title || !description || !price) {
        return buildResponse(400, {message: "Title, description and price are required"}, ['POST'])
    }

    const id = uuid();

    try {

        await dynamoDb.transactWrite({
            TransactItems: [
                {
                    Put: {
                        TableName: PRODUCTS_TABLE!,
                        Item: {
                            id,
                            title,
                            description,
                            price
                        }
                    }
                },
                {
                    Put: {
                        TableName: STOCK_TABLE!,
                        Item: {
                            product_id: id,
                            count: count || 1
                        }
                    }
                }]
        }).promise();

        return buildResponse(201, {id}, ['POST'])
    } catch (error) {

        console.error('Error retrieving product:', error);
        return failure({error: 'Failed to retrieve product'}, ['POST'])
    }

};
