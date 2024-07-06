import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { CATALOG_ITEMS_QUEUE_ARN } from '../../../constants';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IQueue } from 'aws-cdk-lib/aws-sqs';

export class ProductsQueueConstruct extends Construct {
  catalogItemsQueue: IQueue;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    const catalogItemsQueueUrl = cdk.Fn.importValue(CATALOG_ITEMS_QUEUE_ARN);
    this.catalogItemsQueue = sqs.Queue.fromQueueArn(this, 'catalogItemsQueue', catalogItemsQueueUrl);
  }
}
