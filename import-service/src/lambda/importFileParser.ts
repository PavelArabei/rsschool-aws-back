// import * as AWS from 'aws-sdk';
import { S3Event, S3Handler } from 'aws-lambda';
import { Readable } from 'node:stream';
import { csvParser } from './helpers/csv-parser';
import { copyFile, deleteFile, getFile } from './helpers/s3-command';
import { lambdaNotification } from './helpers/sqs-command';


export const handler: S3Handler = async (event: S3Event): Promise<void> => {
  const bucketName = process.env.BUCKET_NAME!;

  for (const record of event.Records) {

    const key = record.s3.object.key;

    console.log('Bucket:', bucketName);
    console.log('Object key:', key);


    try {

      const getResponse = await getFile(bucketName, key);
      console.log(getResponse);

      if (!getResponse.Body) {
        throw new Error('Empty body');
      }

      const stream = getResponse.Body as Readable;
      const products = await csvParser(stream);

      const copyResponse = await copyFile(bucketName, key);
      console.log('File has been copied:', copyResponse);

      await deleteFile(bucketName, key);
      console.log('File has been deleted');

      console.log(`file ${key} has been parsed`);

      await lambdaNotification(products);

    } catch (err) {
      console.log('Error from s3', err);
    }

  }
};
