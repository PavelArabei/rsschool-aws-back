import { handler } from '../lambda/catalogBatchProcess';
import { SQSEvent } from 'aws-lambda';
import { createProduct } from '../lambda/helpers/dynamoDBCommands';
import { publishSNS } from '../lambda/helpers/snsCommands';

jest.mock('../lambda/helpers/dynamoDBCommands');
jest.mock('../lambda/helpers/snsCommands');

describe('handler', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process a single valid product from SQS correctly', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({
            title: 'Test Product',
            description: 'Test Description',
            price: 100,
            count: 10,
          }),
        },
      ],
    } as unknown as SQSEvent;

    const mockCreateProduct = jest.fn().mockResolvedValue({
      id: '1',
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
      count: 10,
    });

    const mockPublishSNS = jest.fn().mockResolvedValue({});

    (createProduct as jest.Mock).mockImplementation(mockCreateProduct);
    (publishSNS as jest.Mock).mockImplementation(mockPublishSNS);

    await handler(event);

    expect(mockCreateProduct).toHaveBeenCalledWith({
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
      count: 10,
    });
    expect(mockPublishSNS).toHaveBeenCalledWith({
      id: '1',
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
      count: 10,
    });
  });

  it('should call publishSNS and createProduct for each successfully created product', async () => {
    const event = {
      Records: [
        { body: JSON.stringify({ title: 'Test Product', description: 'Test Description', price: '10.99', count: 5 }) },
        {
          body: JSON.stringify({
            title: 'Test Product 2',
            description: 'Test Description 2',
            price: '20.99',
            count: 3,
          }),
        },
      ],
    } as unknown as SQSEvent;


    const mockCreateProduct = jest.fn().mockResolvedValue({
      id: '123',
      title: 'Test Product',
      description: 'Test Description',
      price: '10.99',
      count: 5,
    });
    const mockPublishSNS = jest.fn();

    (createProduct as jest.Mock).mockImplementation(mockCreateProduct);
    (publishSNS as jest.Mock).mockImplementation(mockPublishSNS);

    await handler(event);

    expect(mockCreateProduct).toHaveBeenCalledTimes(2);
    expect(mockPublishSNS).toHaveBeenCalledTimes(2);
  });

  it('should log an error when a product has incorrect fields and not call publishSNS and createProduct', async () => {
    const event = {
      Records: [
        { body: JSON.stringify({ title: 'Product 2', description: 'Description 2' }) },
      ],
    } as unknown as SQSEvent;

    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

    const mockCreateProduct = jest.fn();
    const mockPublishSNS = jest.fn();

    (createProduct as jest.Mock).mockImplementation(jest.fn());
    (publishSNS as jest.Mock).mockImplementation(jest.fn());

    await handler(event);

    expect(mockCreateProduct).not.toHaveBeenCalled();
    expect(mockPublishSNS).not.toHaveBeenCalled();
    expect(consoleLogMock).toHaveBeenNthCalledWith(3, 'Error while creating product', new Error('Product has incorrect fields'));
  });

  it('should log an error when createProduct throws an exception and not call publishSNS', async () => {
    const event = {
      Records: [
        { body: JSON.stringify({ title: 'Test Product', description: 'Test Description', price: '10' }) },
      ],
    } as unknown as SQSEvent;

    const testError = 'Test Error';

    const mockCreateProduct = jest.fn().mockRejectedValue(new Error(testError));
    const mockPublishSNS = jest.fn();

    (createProduct as jest.Mock).mockImplementation(mockCreateProduct);
    (publishSNS as jest.Mock).mockImplementation(mockPublishSNS);

    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();


    await handler(event);

    expect(mockCreateProduct).toHaveBeenCalled();
    expect(mockPublishSNS).not.toHaveBeenCalled();
    expect(consoleLogMock).toHaveBeenNthCalledWith(3, 'Error while creating product', new Error(testError));
  });

});
