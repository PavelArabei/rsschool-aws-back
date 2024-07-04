import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class APIGateWayClass extends Construct {

  constructor(scope: Construct, id: string, { importProductsFileLambda }: {
    importProductsFileLambda: lambda.Function
  }) {
    super(scope, id);

    const api = new apigw.RestApi(this, id, {
      restApiName: 'Import Service',
      cloudWatchRole: true,
    });

    const importProducts = api.root.addResource('import');
    importProducts.addMethod('GET', new apigw.LambdaIntegration(importProductsFileLambda));


  }
}
