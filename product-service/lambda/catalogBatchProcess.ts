import { SQSEvent } from 'aws-lambda';
import { ProductWithoutId } from '../types/product';
import { createProduct } from './helpers/dynamoDBCommands';
import { publishSNS } from './helpers/snsCommands';
import { isProductHasCorrectFields } from './helpers/isProductHasCorrectFields';

export const handler = async (event: SQSEvent) => {

  console.log('request', JSON.stringify(event));
  const products: ProductWithoutId[] = event.Records.flatMap(record => JSON.parse(record.body));
  console.log('products from sqs:', products);

  for (const product of products) {

    try {

      if (!isProductHasCorrectFields(product)) {
        throw new Error('Product has incorrect fields');
      }

      const wholeProduct = await createProduct(product);

      await publishSNS(wholeProduct);

    } catch (error) {
      console.log('Error while creating product', error);
    }

  }

};
