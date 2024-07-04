import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

interface ApiGWConstructsProps {
  getProductsListLambda: IFunction;
  getProductByIdLambda: IFunction;
  createProductLambda: IFunction;
}

export class ApiGWConstructs extends Construct {
  api: apigw.RestApi;

  constructor(
    scope: Construct,
    id: string,
    {
      getProductsListLambda,
      getProductByIdLambda,
      createProductLambda,
    }: ApiGWConstructsProps,
  ) {
    super(scope, id);

    const api = new apigw.RestApi(this, 'ProductServiceApi', {
      restApiName: 'ProductService',
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: apigw.Cors.DEFAULT_HEADERS,
      },
    });

    const productsResources = api.root.addResource('products');
    productsResources.addMethod(
      'GET',
      new apigw.LambdaIntegration(getProductsListLambda),
    );
    productsResources.addMethod(
      'POST',
      new apigw.LambdaIntegration(createProductLambda),
    );

    const productResourceGet = productsResources.addResource('{productId}');
    productResourceGet.addMethod(
      'GET',
      new apigw.LambdaIntegration(getProductByIdLambda),
    );
  }
}
