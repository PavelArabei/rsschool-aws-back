import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class ImportBucket extends Construct {
  public readonly bucket: s3.IBucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, id, {
      bucketName: 'import-service-bucket-rs-school',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new s3deploy.BucketDeployment(this, 'DeployFolders', {
      sources: [s3deploy.Source.data('dummy', '')],
      destinationBucket: this.bucket,
      destinationKeyPrefix: 'uploaded/',
    });

    new s3deploy.BucketDeployment(this, 'DeployFoldersParsed', {
      sources: [s3deploy.Source.data('dummy', '')],
      destinationBucket: this.bucket,
      destinationKeyPrefix: 'parsed/',
    });
  }
}
