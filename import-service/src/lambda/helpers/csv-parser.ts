import { Readable } from 'node:stream';
import * as csv from 'csv-parser';

export const csvParser = async (stream: Readable): Promise<void> => {
  return new Promise((res, rej) => {
    stream.pipe(csv())
      .on('data', (data: string) => {
        console.log(data);
      })
      .on('end', () => {
        res();
      }).on('error', (err) => {
      rej(err);
      console.log('error parsing csv', err);
    });
  });
};
