import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {Products} from "../types/products";
import {buildResponse, success} from "./helpers/response";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters?.productId;
    if (!productId) {
        return buildResponse(400, {message: "Product ID is required"})
    }

    const products: Products[] = JSON.parse(process.env.PRODUCTS || '[]');
    const product = products.find(p => p.id === productId);

    if (product) return success(product)

    return buildResponse(404, {message: "Product not found"})

};
