import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoDBTablesConstruct } from './constructs/dynamoDBTables.construct';
import { LambdasInteractionWithDBConstruct } from './constructs/lambdasInteractionWithDB.construct';
import { ApiGWConstructs } from './constructs/apiGW.constructs';
import { CatalogQueueConstruct } from './constructs/catalogQueue.construct';
import { SnsTopicConstruct } from './constructs/snsTopic.construct';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const { catalogItemsQueue } = new CatalogQueueConstruct(this, 'CatalogQueueConstruct');
    const { createProductTopic } = new SnsTopicConstruct(this, 'SnsTopicConstruct');

    const { getProductsListLambda, getProductByIdLambda, createProductLambda } =
      new LambdasInteractionWithDBConstruct(this, 'LambdasInteractionWithDBConstruct', { SQS_URL: catalogItemsQueue.queueUrl });


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
