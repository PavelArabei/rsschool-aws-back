import { Readable } from 'node:stream';
import * as csv from 'csv-parser';
import { Product } from '../../../types/product';

export const csvParser = async (stream: Readable): Promise<Product[]> => {
  return new Promise((res, rej) => {
    const products: Product[] = [];

    stream.pipe(csv())
      .on('data', (data: Product) => products.push(data))
      .on('end', () => {
        console.log(products);
        res(products);
      }).on('error', (err) => {
      rej(err);
      console.log('error parsing csv', err);
    });
  });
};
