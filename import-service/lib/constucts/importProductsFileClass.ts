import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IQueue } from 'aws-cdk-lib/aws-sqs';

import * as lambda from 'aws-cdk-lib/aws-lambda';

interface ImportProductsFileClassProps {
  bucket: s3.IBucket;
  catalogItemsQueue: IQueue;
}

export class ImportProductsFileClass extends Construct {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, { bucket, catalogItemsQueue }: ImportProductsFileClassProps) {
    super(scope, id);


    this.handler = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'importProductsFile.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        SQS_URL: catalogItemsQueue.queueUrl,
      },
    });

    bucket.grantReadWrite(this.handler);
    bucket.grantPut(this.handler);

    catalogItemsQueue.grantSendMessages(this.handler);

  }
}
