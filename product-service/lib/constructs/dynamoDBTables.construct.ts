import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } from '../conts/constantas';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

interface DynamoDBTablesProps {
  getProductsListLambda: IFunction;
  getProductByIdLambda: IFunction;
  createProductLambda: IFunction;
}

export class DynamoDBTablesConstruct extends Construct {
  productsTable: ITable;
  stockTable: ITable;

  constructor(scope: Construct, id: string, {
    getProductsListLambda,
    getProductByIdLambda,
    createProductLambda,
  }: DynamoDBTablesProps) {
    super(scope, id);

    this.productsTable = dynamodb.Table.fromTableName(this, 'ImportedProductsTable', PRODUCTS_TABLE_NAME) ||
      new dynamodb.Table(this, 'ProductsTable', {
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'title', type: dynamodb.AttributeType.STRING },
        tableName: PRODUCTS_TABLE_NAME,
        // removalPolicy: cdk.RemovalPolicy.DESTROY
      });

    this.stockTable = dynamodb.Table.fromTableName(this, 'ImportedStockTableTable', STOCKS_TABLE_NAME) ||
      new dynamodb.Table(this, 'stockTableTable', {
        partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'count', type: dynamodb.AttributeType.NUMBER },
        tableName: PRODUCTS_TABLE_NAME,
        // removalPolicy: cdk.RemovalPolicy.DESTROY
      });


    this.productsTable.grant(createProductLambda, 'dynamodb:PutItem');
    this.stockTable.grant(createProductLambda, 'dynamodb:PutItem');

    this.productsTable.grant(getProductsListLambda, 'dynamodb:Scan');
    this.stockTable.grant(getProductsListLambda, 'dynamodb:Scan');

    this.productsTable.grant(getProductByIdLambda, 'dynamodb:BatchGetItem');
    this.stockTable.grant(getProductByIdLambda, 'dynamodb:BatchGetItem');


  }
}
