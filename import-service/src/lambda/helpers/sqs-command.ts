import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Product } from '../../../types/product';

const sqsClient = new SQSClient({});

export const lambdaNotification = async (products: Product[]): Promise<void> => {

  const msgCommand = new SendMessageCommand({
    QueueUrl: process.env.SQS_URL,
    MessageBody: JSON.stringify(products),
  });

  const response = await sqsClient.send(msgCommand);
  console.log(response);
};
