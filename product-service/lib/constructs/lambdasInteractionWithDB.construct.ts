import { Construct } from 'constructs';
import { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } from '../conts/constantas';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

interface LambdasInteractionWithDBProps {
  SQS_URL: string;
  SNS_ARN: string;
}

export class LambdasInteractionWithDBConstruct extends Construct {

  getProductByIdLambda: IFunction;
  getProductsListLambda: IFunction;
  createProductLambda: IFunction;
  catalogBatchProcessLambda: IFunction;

  constructor(scope: Construct, id: string, props: LambdasInteractionWithDBProps) {
    super(scope, id);

    const lambdasEnvironment = {
      PRODUCTS_TABLE: PRODUCTS_TABLE_NAME,
      STOCK_TABLE: STOCKS_TABLE_NAME,
    };

    this.getProductsListLambda = new lambda.Function(this, 'GetProductsListHandler', {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset('lambda'),
        handler: 'getProductsList.handler',
        environment: lambdasEnvironment,
      },
    );

    this.getProductByIdLambda = new lambda.Function(this, 'GetProductByIdHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsById.handler',
      environment: lambdasEnvironment,
    });

    this.createProductLambda = new lambda.Function(this, 'CreateProductHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'createProduct.handler',
      environment: lambdasEnvironment,
    });


    this.catalogBatchProcessLambda = new lambda.Function(this, 'CatalogBatchProcessHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'catalogBatchProcess.handler',
      environment: {
        ...lambdasEnvironment,
        SQS_URL: props.SQS_URL,
        SNS_ARN: props.SNS_ARN,
      },
    });


  }
}
