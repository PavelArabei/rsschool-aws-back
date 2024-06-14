import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {Construct} from 'constructs';
import {Products} from "../types/products";

const mockProducts: Products[] = [
    {
        id: "1",
        title: "guitar",
        description: "The best guitar",
        price: 100
    },
    {
        id: "2",
        title: "piano",
        description: "The best piano",
        price: 200

    },
    {
        id: "3",
        title: "drum",
        description: "The best drum",
        price: 300
    },
    {
        id: "4",
        title: "violin",
        description: "The best violin",
        price: 400
    },
    {
        id: "5",
        title: "saxophone",
        description: "The best saxophone",
        price: 500
    },
    {
        id: "6",
        title: "trumpet",
        description: "The best trumpet",
        price: 600
    },
    {
        id: "7",
        title: "flute",
        description: "The best flute",
        price: 700
    },
    {
        id: "8",
        title: "cello",
        description: "The best cello",
        price: 800
    }

]

export class ProductServiceStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const productsTableName = 'PRODUCTS_TABLE'
        const stocksTableName = 'STOCK_TABLE'

        const productsTable = dynamodb.Table.fromTableName(this, 'ImportedProductsTable', productsTableName) ||
            new dynamodb.Table(this, 'ProductsTable', {
                partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
                sortKey: {name: 'title', type: dynamodb.AttributeType.STRING},
                tableName: productsTableName,
                // removalPolicy: cdk.RemovalPolicy.DESTROY
            });

        const stockTable = dynamodb.Table.fromTableName(this, 'ImportedStocksTable', stocksTableName) ||
            new dynamodb.Table(this, 'StocksTable', {
                partitionKey: {name: 'product_id', type: dynamodb.AttributeType.STRING},
                sortKey: {name: 'count', type: dynamodb.AttributeType.NUMBER},
                tableName: stocksTableName,
                // removalPolicy: cdk.RemovalPolicy.DESTROY
            });


        const lambdasEnvironment = {
            PRODUCTS_TABLE: productsTable.tableName,
            STOCK_TABLE: stockTable.tableName
        }

        const getProductsListLambda = new lambda.Function(this, 'GetProductsListHandler', {
                runtime: lambda.Runtime.NODEJS_20_X,
                code: lambda.Code.fromAsset('lambda'),
                handler: 'getProductsList.handler',
                environment: lambdasEnvironment
            },
        );


        const getProductByIdLambda = new lambda.Function(this, 'GetProductByIdHandler', {
            runtime: lambda.Runtime.NODEJS_20_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'getProductsById.handler',
            environment: lambdasEnvironment
        });


        const api = new apigw.RestApi(this, 'ProductServiceApi', {
            restApiName: 'ProductService',
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: apigw.Cors.ALL_METHODS,
                allowHeaders: apigw.Cors.DEFAULT_HEADERS
            }
        });


        [productsTable, stockTable].forEach(table => {
            table.grantReadData(getProductsListLambda)
            table.grantReadData(getProductByIdLambda)
        })

        const productsResource = api.root.addResource('products');
        productsResource.addMethod('GET', new apigw.LambdaIntegration(getProductsListLambda))

        const productResource = productsResource.addResource('{productId}');
        productResource.addMethod('GET', new apigw.LambdaIntegration(getProductByIdLambda))


    }
}
