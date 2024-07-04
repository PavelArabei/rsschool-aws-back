import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cr from 'aws-cdk-lib/custom-resources';

export class ImportBucketClass extends Construct {
  public readonly bucket: s3.IBucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.bucket = s3.Bucket.fromBucketName(this, id, 'import-service-bucket-rs-school');

    const corsRule = {
      AllowedHeaders: ['*'],
      AllowedMethods: ['PUT'],
      AllowedOrigins: ['*'],
    };

    new cr.AwsCustomResource(this, 'PutCorsConfiguration', {
      onCreate: {
        service: 'S3',
        action: 'putBucketCors',
        parameters: {
          Bucket: this.bucket.bucketName,
          CORSConfiguration: {
            CORSRules: [corsRule],
          },
        },
        physicalResourceId: cr.PhysicalResourceId.of(`PutCorsConfiguration-${this.bucket.bucketName}`),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

  }
}
