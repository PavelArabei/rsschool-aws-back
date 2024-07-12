import { publishSNS } from '../lambda/helpers/snsCommands';
import { PublishCommand, ServiceInputTypes, SNSClient } from '@aws-sdk/client-sns';
import { mockClient } from 'aws-sdk-client-mock';

const snsMock = mockClient(SNSClient);

describe('createSNS', (): void => {
  const product = {
    id: '1234',
    title: 'Test Product',
    description: 'This is a test product',
    price: 100,
    count: 10,
  };

  beforeEach((): void => {
    snsMock.reset();
    snsMock.on(PublishCommand).resolves({ MessageId: 'mockMessageId' });
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it('should publish an SNS message with the correct attributes', async (): Promise<void> => {
    await publishSNS(product);

    expect(snsMock.send.callCount).toBe(1);
    const callArgs: ServiceInputTypes = snsMock.send.getCall(0).args[0].input;

    expect(callArgs).toEqual({
      Message: `Product created: ${product.title} (price: ${product.price}, description: ${product.description}, count: ${product.count})`,
      MessageAttributes: {
        price: {
          DataType: 'Number',
          StringValue: product.price.toString(),
        },
      },
      TopicArn: expect.any(String),
    });
  });

  it('should log a message on successful publish', async () => {
    console.log = jest.fn();

    await publishSNS(product);

    expect(console.log).toHaveBeenCalledWith(`Product from SQS with ${product.title} was placed in db tables (price: ${product.price}, description: ${product.description}, count: ${product.count}, id:${product.id})`);
  });

  it('should handle errors during SNS publish', async () => {
    snsMock.on(PublishCommand).rejects(new Error('SNS publish failed'));

    await expect(publishSNS(product)).rejects.toThrow('SNS publish failed');
  });
});
