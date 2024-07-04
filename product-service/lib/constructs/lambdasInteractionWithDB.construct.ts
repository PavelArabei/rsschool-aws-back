import { Construct } from 'constructs';
import { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } from '../conts/constantas';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class LambdasInteractionWithDBConstruct extends Construct {

  getProductByIdLambda: lambda.Function;
  getProductsListLambda: lambda.Function;
  createProductLambda: lambda.Function;

  constructor(scope: Construct, id: string) {
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


  }
}
