import { createProduct } from '../lambda/helpers/dynamoDBCommands';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../lambda/createProduct';

jest.mock('../lambda/helpers/dynamoDBCommands');
jest.mock('../lambda/helpers/snsCommands');

describe('handler', () => {

  it('should return 201 status code and product id when valid product data is provided', async () => {
    // Given
    const event = {
      body: JSON.stringify({
        title: 'Test Product',
        description: 'Test Description',
        price: 100,
        count: 10,
      }),
    } as unknown as APIGatewayProxyEvent;

    const mockCreateProduct = jest.fn().mockResolvedValue({
      id: '1',
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
      count: 10,
    });

    (createProduct as jest.Mock).mockImplementation(mockCreateProduct);

    const result = await handler(event, {} as any, {} as any) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({ id: '1' });
    expect(mockCreateProduct).toHaveBeenCalledWith({
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
      count: 10,
    });
  });

  it('should return 400 status code when required fields are missing', async () => {
    const event = {
      body: JSON.stringify({
        title: '',
        description: '',
        price: null,
      }),
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(event, {} as any, {} as any) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ message: 'Title, description and price are required' });
  });

});
