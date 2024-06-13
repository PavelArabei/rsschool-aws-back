import {APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {Products} from "../types/products";
import {success} from "./helpers/response";

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
    const products: Products[] = JSON.parse(process.env.PRODUCTS || '[]');

    return success(products)
};
