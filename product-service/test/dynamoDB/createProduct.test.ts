import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createProduct } from '../../lambda/helpers/dynamoDBCommands';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('createSNS', (): void => {
  const product = {
    title: 'Test Product',
    description: 'This is a test product',
    price: 100,
    count: 10,
  };


  beforeEach(() => {
    ddbMock.reset();
  });


  afterEach((): void => {
    jest.clearAllMocks();
  });

  it('should create and return a product with valid input', async (): Promise<void> => {

    const result = await createProduct(product);
    expect(ddbMock.send.callCount).toBe(1);

    expect(result).toEqual({ ...product, id: expect.any(String) });

  });

  it('should default count to 1 when missing', async () => {
    const productWithoutCount = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 100,
    };


    const result = await createProduct(productWithoutCount);

    expect(ddbMock.send.callCount).toBe(1);
    expect(result).toEqual({ ...productWithoutCount, count: 1, id: expect.any(String) });

  });

});
