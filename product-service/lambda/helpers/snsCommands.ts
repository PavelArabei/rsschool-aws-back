import { ProductWithoutId } from '../../types/product';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({});
export const publishSNS = async ({ title, price, description, count }: ProductWithoutId) => {
  const message = `Product created: ${title} (price: ${price}, description: ${description}, count: ${count || 1})`;

  const publishCommand = new PublishCommand({
    TopicArn: process.env.SNS_ARN || '',
    Message: message,
  });

  await snsClient.send(publishCommand);
  console.log(`Product from SQS with ${title} was placed in db tables (price: ${price}, description: ${description}, count: ${count || 1})`);

};