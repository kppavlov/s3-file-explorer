import {
  ListObjectsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

class S3 {
  private static instance: S3 | null = null;

  private static accessKeyId: string = "AKIATOK7VIOCYL4L6EXY";
  private static accessKeySecret: string =
    "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";
  private static bucketName: string = "llib-236960695173-25";
  private static region: string = "eu-west-1";
  private static s3ClientInstance: S3Client | null = null;

  constructor() {
    if (S3.instance !== null) {
      return S3.instance;
    }

    S3.s3ClientInstance = new S3Client({
      region: S3.region,
      credentials: {
        accessKeyId: S3.accessKeyId,
        secretAccessKey: S3.accessKeySecret,
      },
    });

    S3.instance = this;

    return this;
  }

  static setProperties({
    region,
    accessKeySecret,
    accessKeyId,
    bucketName,
  }: {
    accessKeyId: string;
    accessKeySecret: string;
    bucketName: string;
    region: string;
  }) {
    S3.accessKeyId = accessKeyId;
    S3.accessKeySecret = accessKeySecret;
    S3.bucketName = bucketName;
    S3.region = region;

    S3.s3ClientInstance = new S3Client({
      region: S3.region,
      credentials: {
        accessKeyId: S3.accessKeyId,
        secretAccessKey: S3.accessKeySecret,
      },
    });

    return this;
  }

  static getInstance() {
    if (S3.instance === null) {
      throw new Error("No Instance created.");
    }
    return this;
  }

  static async listObjects() {
    if (!S3.s3ClientInstance) {
      throw new Error("No s3ClientInstance found.");
    }

    return await S3.s3ClientInstance.send(
      new ListObjectsCommand({
        Bucket: S3.bucketName,
      }),
    );
  }

  static async createObject(file: Blob, path: string) {
    if (!S3.s3ClientInstance) {
      throw new Error("No s3ClientInstance found.");
    }

    const input: PutObjectCommandInput = {
      Bucket: S3.bucketName,
      Key: path,
      Body: await file.arrayBuffer(),
      ContentType: file.type,
    };
    return await S3.s3ClientInstance.send(new PutObjectCommand(input));
  }
}

new S3();

export default S3;
