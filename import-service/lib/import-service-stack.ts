import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { ImportBucket } from './constucts/bucket';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { bucket } = new ImportBucket(this, 'import-service-bucket');

    const lambdaEnvironmentVariables = {
      BUCKET_NAME: bucket.bucketName,
    };

    const importProductsFileLambda = new lambda.Function(this, 'ImportProductsFileLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'importProductsFile.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: lambdaEnvironmentVariables,
    });

    const importFileParserLambda = new lambda.Function(this, 'ImportFileParserLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'importFileParser.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: lambdaEnvironmentVariables,
    });

    bucket.grantReadWrite(importFileParserLambda);

    importFileParserLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3:PutObject'],
        resources: [`${bucket.bucketArn}/*`],
      })
    );

    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(importFileParserLambda),
      {
        prefix: 'uploaded/',
      }
    );

    const api = new apigw.RestApi(this, 'ImportApi', {
      restApiName: 'Import Service',
      cloudWatchRole: true,
    });

    const importProducts = api.root.addResource('import');
    importProducts.addMethod('GET', new apigw.LambdaIntegration(importProductsFileLambda));
  }
}
