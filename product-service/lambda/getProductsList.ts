import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { failure, success } from './helpers/response';
import { getProducts } from './helpers/dynamoDBCommands';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('pathParameters', event.pathParameters);
  try {

    const products = await getProducts();

    return success(products);

  } catch (error) {
    console.error('Error retrieving products:', error);
    return failure({ error: 'Failed to retrieve products' });
  }

};
