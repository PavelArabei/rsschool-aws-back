import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, failure, success } from './helpers/response';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DEFAULT_REGION } from './helpers/const';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const bucketName = process.env.BUCKET_NAME!;
  const fileName = event.queryStringParameters?.name;

  console.log('importProductsFile event', event);

  if (!fileName) {
    return buildResponse(400, { message: 'Name parameter is required' });
  }

  const s3Client = new S3Client({ region: DEFAULT_REGION });

  const command: PutObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: `uploaded/${fileName}`,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 360 });

    console.log('signedUrl created successfully', signedUrl);

    return success({ url: signedUrl }, ['POST', 'GET']);
  } catch (error) {
    console.log('Could not create signed URL', error);
    return failure({ message: 'Could not create signed URL', error });
  }
};
