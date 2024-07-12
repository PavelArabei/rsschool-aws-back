import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';

import * as iam from 'aws-cdk-lib/aws-iam';

import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { LAMBDA_AUTHORIZER_ARN } from '../../../constants';
import * as dotenv from 'dotenv';

dotenv.config();

export class LambdaAuthorizerConstruct extends Construct {

  handler: IFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const environment = {
      PASSWORD: process.env.PASSWORD ?? '',
      LOGIN: process.env.LOGIN ?? '',
    };

    this.handler = new lambda.Function(this, 'AuthorizationHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'basicAuthorizer.handler',
      code: lambda.Code.fromAsset('src/handlers'),
      environment,
    });


    this.handler.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));


    new cdk.CfnOutput(this, 'LambdaAuthorizerArn', {
      value: this.handler.functionArn,
      exportName: LAMBDA_AUTHORIZER_ARN,
    });

  }
}
