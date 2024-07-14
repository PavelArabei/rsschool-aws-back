import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import { LAMBDA_AUTHORIZER_ARN } from '../../../constants';

export class APIGateWayClass extends Construct {

  constructor(scope: Construct, id: string, { importProductsFileLambda }: {
    importProductsFileLambda: lambda.Function
  }) {
    super(scope, id);

    const responseHeaders = {
      'Access-Control-Allow-Origin': '\'*\'',
      'Access-Control-Allow-Headers':
        '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
      'Access-Control-Allow-Methods': '\'OPTIONS,GET,PUT\'',
    };

    const lambdaArn = cdk.Fn.importValue(LAMBDA_AUTHORIZER_ARN);
    const lambdaAuthorizer = lambda.Function.fromFunctionArn(this, 'importAuthorizer', lambdaArn);

    const api = new apigw.RestApi(this, id, {
      restApiName: 'Import Service',
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: apigw.Cors.DEFAULT_HEADERS,
      },
    });

    const importProducts = api.root.addResource('import');

    const authorizer = new apigw.TokenAuthorizer(this, 'basicAuthorizer', {
      identitySource: 'method.request.header.Authorization',
      handler: lambdaAuthorizer,
    });

    importProducts.addMethod('GET', new apigw.LambdaIntegration(importProductsFileLambda), {
      authorizationType: apigw.AuthorizationType.CUSTOM,
      authorizer,
    });


    api.addGatewayResponse('GatewayResponseUnauthorized', {
      type: apigw.ResponseType.UNAUTHORIZED,
      responseHeaders,
      statusCode: '401',
    });

    api.addGatewayResponse('GatewayResponseAccessDenied', {
      type: apigw.ResponseType.ACCESS_DENIED,
      responseHeaders,
      statusCode: '403',
    });


  }
}
