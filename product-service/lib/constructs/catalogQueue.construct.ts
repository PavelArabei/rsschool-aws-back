import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { CATALOG_ITEMS_QUEUE_ARN } from '../../../constants';

export class CatalogQueueConstruct extends Construct {
  catalogItemsQueue: IQueue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.catalogItemsQueue = new sqs.Queue(this, 'CatalogItemsQueue', {
      queueName: 'catalogItemsQueue',
    });

    new cdk.CfnOutput(this, 'CatalogItemsQueueUrl', {
      value: this.catalogItemsQueue.queueArn,
      exportName: CATALOG_ITEMS_QUEUE_ARN,
    });


  }
}
