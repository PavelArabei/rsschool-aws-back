import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaAuthorizerConstruct } from './constructs/lambda-authorizer.construct';

export class AuthorizationServiceStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new LambdaAuthorizerConstruct(this, 'LambdaAuthorizerConstruct');
  }
}
