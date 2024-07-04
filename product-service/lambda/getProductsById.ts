import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { buildResponse, failure, success } from './helpers/response';
import { getProduct } from './helpers/dynamoDBCommands';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters?.productId;
  console.log('productId', productId);

  if (!productId) {
    return buildResponse(400, { message: 'Product ID is required' });
  }


  try {

    const product = await getProduct(productId);
    return success(product);

  } catch (error: any) {
    console.error('Error retrieving product:', error);
    return failure({ error: 'Failed to retrieve product: ' + error.message });
  }
};
