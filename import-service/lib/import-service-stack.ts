import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ImportProductsFileClass } from './constucts/importProductsFileClass';
import { ImportFileParsedClass } from './constucts/importFileParsedClass';
import { APIGateWayClass } from './constucts/APIGateWayClass';
import { ImportBucketClass } from './constucts/importBucketClass';
import { ProductsQueueConstruct } from './constucts/productsQueue.construct';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { bucket } = new ImportBucketClass(this, 'ImportProductsBucket');

    const { catalogItemsQueue } = new ProductsQueueConstruct(this, 'ProductsQueue');


    const importProductsFileLambda = new ImportProductsFileClass(this, 'ImportProductsFileLambda', {
      bucket,
    });

    new ImportFileParsedClass(this, 'ImportFileParserLambda', { bucket, catalogItemsQueue });

    new APIGateWayClass(this, 'ImportApi', { importProductsFileLambda: importProductsFileLambda.handler });

  }
}
