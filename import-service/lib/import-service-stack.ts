import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ImportProductsFileClass } from './constucts/importProductsFileClass';
import { ImportFileParsedClass } from './constucts/importFileParsedClass';
import { APIGateWayClass } from './constucts/APIGateWayClass';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = s3.Bucket.fromBucketName(this, 'ImportBucket', 'import-service-bucket-rs-school');

    const importProductsFileLambda = new ImportProductsFileClass(this, 'ImportProductsFileLambda', { bucket });
    const importFileParserLambda = new ImportFileParsedClass(this, 'ImportFileParserLambda', { bucket });

    new APIGateWayClass(this, 'ImportApi', { importProductsFileLambda: importProductsFileLambda.handler });


    // importFileParserLambda.addToRolePolicy(
    //   new iam.PolicyStatement({
    //     actions: ['s3:PutObject'],
    //     resources: [`${bucket.bucketArn}/*`],
    //   })
    // );
  }
}
