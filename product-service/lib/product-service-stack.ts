import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoDBTablesConstruct } from './constructs/dynamoDBTables.construct';
import { LambdasInteractionWithDBConstruct } from './constructs/lambdasInteractionWithDB.construct';
import { ApiGWConstructs } from './constructs/apiGW.constructs';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const { getProductsListLambda, getProductByIdLambda, createProductLambda } =
      new LambdasInteractionWithDBConstruct(this, 'LambdasInteractionWithDBConstruct');


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
