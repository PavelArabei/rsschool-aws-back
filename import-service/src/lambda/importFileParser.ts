import * as AWS from 'aws-sdk';

import { S3Event, S3Handler } from 'aws-lambda';
import * as csv from 'csv-parser';

const s3 = new AWS.S3();

export const handler: S3Handler = async (event: S3Event): Promise<void> => {
  const bucketName = process.env.BUCKET_NAME!;

  for (const record of event.Records) {
    const params = {
      Bucket: bucketName,
      Key: record.s3.object.key,
    };

    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream
      .pipe(csv())
      .on('data', (data: string) => {
        console.log(data);
      })
      .on('end', async () => {
        const copyParams = {
          Bucket: bucketName,
          CopySource: `${bucketName}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded/', 'parsed/'),
        };

        await s3.copyObject(copyParams).promise();
        await s3.deleteObject(params).promise();
      });
  }
};
