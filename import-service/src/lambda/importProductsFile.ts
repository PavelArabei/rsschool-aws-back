import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';

import * as AWS from "aws-sdk";
import {buildResponse} from "./helpers/response";

const s3 = new AWS.S3();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bucketName = process.env.BUCKET_NAME;
    const name = event.queryStringParameters?.name;

    if (!name) {
        return buildResponse(400, {message: "Name parameter is required"}, ['POST'])
    }

    const params = {
        Bucket: bucketName,
        Key: `uploaded/${name}`,
        Expires: 60,
        ContentType: 'text/csv'
    };

    try {
        const signedUrl = s3.getSignedUrl('putObject', params);
        return {
            statusCode: 200,
            body: JSON.stringify({url: signedUrl}),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Could not create signed URL', error}),
        };
    }
};
