import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoDBTablesConstruct } from './constructs/dynamoDBTables.construct';
import { LambdasInteractionWithDBConstruct } from './constructs/lambdasInteractionWithDB.construct';
import { ApiGWConstructs } from './constructs/apiGW.constructs';
import { CatalogQueueConstruct } from './constructs/catalogQueue.construct';
import { SnsTopicConstruct } from './constructs/snsTopic.construct';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const { catalogItemsQueue } = new CatalogQueueConstruct(this, 'CatalogQueueConstruct');
    const { createProductTopic } = new SnsTopicConstruct(this, 'SnsTopicConstruct');

    const {
      getProductsListLambda,
      getProductByIdLambda,
      createProductLambda,
      catalogBatchProcessLambda,
    } =
      new LambdasInteractionWithDBConstruct(this, 'LambdasInteractionWithDBConstruct', {
        SQS_URL: catalogItemsQueue.queueUrl,
        SNS_ARN: createProductTopic.topicArn,
      });

    catalogBatchProcessLambda.addEventSource(new SqsEventSource(catalogItemsQueue, {
      batchSize: 5,
    }));

    catalogItemsQueue.grantConsumeMessages(catalogBatchProcessLambda);
    createProductTopic.grantPublish(catalogBatchProcessLambda);


    new DynamoDBTablesConstruct(this, 'DynamoDBTablesConstruct',
      {
        getProductsListLambda,
        getProductByIdLambda,
        createProductLambda,
      });


    new ApiGWConstructs(this, 'ApiGWConstructs', {
      getProductsListLambda,
      getProductByIdLambda,
      createProductLambda,
    });

  }
}
