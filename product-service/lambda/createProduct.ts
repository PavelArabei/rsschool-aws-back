import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { buildResponse, failure } from './helpers/response';
import { ProductWithoutId } from '../types/product';
import { createProduct } from './helpers/dynamoDBCommands';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const body = JSON.parse(event.body!) as ProductWithoutId;
  console.log('productId', body);

  const { title, description, price, count } = body;

  if (!title || !description || !price) {
    return buildResponse(400, { message: 'Title, description and price are required' }, ['POST']);
  }


  try {

    const { id } = await createProduct({ title, description, price, count });

    return buildResponse(201, { id }, ['POST']);

  } catch (error) {

    console.error('Error retrieving product:', error);
    return failure({ error: 'Failed to retrieve product' }, ['POST']);
  }

};
