import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { IQueue } from 'aws-cdk-lib/aws-sqs';

interface ImportFileParsedProps {
  bucket: s3.IBucket;
  catalogItemsQueue: IQueue;
}

export class ImportFileParsedClass extends Construct {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, { bucket, catalogItemsQueue }: ImportFileParsedProps) {
    super(scope, id);

    this.handler = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'importFileParser.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        SQS_URL: catalogItemsQueue.queueUrl,

      },
    });

    bucket.grantReadWrite(this.handler);
    bucket.grantPut(this.handler);
    bucket.grantDelete(this.handler);

    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(this.handler),
      {
        prefix: 'uploaded/',
      },
    );

    catalogItemsQueue.grantSendMessages(this.handler);
  }
}
