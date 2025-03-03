export type S3FormState = {
  accessKeySecret: string;
  accessKeyId: string;
  bucketName: string;
  region: string;
  error?: string;
}