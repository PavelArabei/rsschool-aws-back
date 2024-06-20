import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class ImportServiceStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, 'ImportBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        })


        const importProductsFileLambda = new lambda.Function(this, 'ImportProductsFileLambda', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'importProductsFile.handler',
            code: lambda.Code.fromAsset('src/lambda'),
            environment: {
                BUCKET_NAME: bucket.bucketName
            }
        });

        const importFileParserLambda = new lambda.Function(this, 'ImportFileParserLambda', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'importFileParser.handler',
            code: lambda.Code.fromAsset('src/lambda'),
            environment: {
                BUCKET_NAME: bucket.bucketName,
            },
        });

        bucket.grantPut(importFileParserLambda)

        const api = new apigw.RestApi(this, 'ImportApi', {
            restApiName: 'Import Service'
        });

        const importProducts = api.root.addResource('import');
        importProducts.addMethod('GET', new apigw.LambdaIntegration(importProductsFileLambda))
    }
}
