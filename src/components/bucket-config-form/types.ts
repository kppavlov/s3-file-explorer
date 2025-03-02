export type S3FormState = {
  accessKeySecret: string;
  accessKeyId: string;
  bucketName: string;
  region: string;
  contents: Array<Array<string>>;
  error?: string;
}