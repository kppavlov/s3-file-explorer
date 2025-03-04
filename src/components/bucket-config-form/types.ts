export type S3FormState = {
  accessKeySecret: string;
  accessKeyId: string;
  bucketName: string;
  region: string;
  error?: string;
};

export type ContentTypes = {
  contentsForPrerequisite: Array<Array<string>>;
  contentsForPathToKeyMap: Array<string>;
};
