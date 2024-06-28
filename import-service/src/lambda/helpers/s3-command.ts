import {
  CopyObjectCommand,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

const client = new S3Client({});

export const getFile = async (bucket: string, key: string): Promise<GetObjectCommandOutput> => {
  const getCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return client.send(getCommand);
};


export const copyFile = async (bucket: string, key: string): Promise<CopyObjectCommandOutput> => {
  const copyCommand = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `${bucket}/${key}`,
    Key: key.replace('uploaded', 'parsed'),
  });
  return client.send(copyCommand);
};


export const deleteFile = async (bucket: string, key: string): Promise<DeleteObjectsCommandOutput> => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return client.send(deleteCommand);
};


