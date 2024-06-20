import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';

import * as AWS from "aws-sdk";
import {buildResponse, failure, success} from "./helpers/response";

const s3 = new AWS.S3();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bucketName = process.env.BUCKET_NAME;
    const name = event.queryStringParameters?.name;

    if (!name) {
        return buildResponse(400, {message: "Name parameter is required"})
    }

    const params = {
        Bucket: bucketName,
        Key: `uploaded/${name}`,
        Expires: 60,
        ContentType: 'text/csv'
    };

    try {

        const signedUrl = s3.getSignedUrl('putObject', params);
        return success({url: signedUrl})

    } catch (error) {

        return failure({message: 'Could not create signed URL', error})

    }
};
