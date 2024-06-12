import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
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

        const getProductsListLambda = new lambda.Function(this, 'GetProductsListHandler', {
                runtime: lambda.Runtime.NODEJS_20_X,
                code: lambda.Code.fromAsset('lambda'),
                handler: 'getProductsList.handler',
                environment: {
                    PRODUCTS: JSON.stringify(mockProducts),
                }
            },
        );

        const getProductByIdLambda = new lambda.Function(this, 'GetProductByIdHandler', {
            runtime: lambda.Runtime.NODEJS_20_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'getProductsById.handler',
            environment: {
                PRODUCTS: JSON.stringify(mockProducts),
            }
        });


        const api = new apigw.RestApi(this, 'ProductServiceApi', {
            restApiName: 'ProductService',
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: apigw.Cors.ALL_METHODS,
                allowHeaders: apigw.Cors.DEFAULT_HEADERS
            }
        });

        const productsResource = api.root.addResource('products');
        productsResource.addMethod('GET', new apigw.LambdaIntegration(getProductsListLambda))

        const productResource = productsResource.addResource('{productId}');
        productResource.addMethod('GET', new apigw.LambdaIntegration(getProductByIdLambda))


    }
}
