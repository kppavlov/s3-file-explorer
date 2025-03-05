import {
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

class S3 {
  private accessKeyId: string = "";
  private accessKeySecret: string = "";
  private bucketName: string = "";
  private region: string = "";
  private s3ClientInstance: S3Client | null = null;

  constructor() {}

  setConnectionProperties({
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
    this.accessKeyId = accessKeyId;
    this.accessKeySecret = accessKeySecret;
    this.bucketName = bucketName;
    this.region = region;

    this.s3ClientInstance = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.accessKeySecret,
      },
    });

    return this;
  }

  async listObjects() {
    if (!this.s3ClientInstance) {
      throw new Error("Please use setConnectionProperties first.");
    }

    return await this.s3ClientInstance.send(
      new ListObjectsV2Command({
        Bucket: this.bucketName,
      }),
    );
  }

  async createObject(file: Blob, path: string) {
    if (!this.s3ClientInstance) {
      throw new Error("Please use setConnectionProperties first.");
    }

    const input: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: path,
      Body: await file.arrayBuffer(),
      ContentType: file.type,
    };
    return await this.s3ClientInstance.send(new PutObjectCommand(input));
  }

  async deleteObject(path: string) {
    if (!this.s3ClientInstance) {
      throw new Error("Please use setConnectionProperties first.");
    }

    const input: DeleteObjectCommandInput = {
      Bucket: this.bucketName,
      Key: path,
    };
    return await this.s3ClientInstance.send(new DeleteObjectCommand(input));
  }

  async getObject(path: string) {
    if (!this.s3ClientInstance) {
      throw new Error("Please use setConnectionProperties first.");
    }

    const input: GetObjectCommandInput = {
      Bucket: this.bucketName,
      Key: path,
    };
    return await this.s3ClientInstance.send(new GetObjectCommand(input));
  }
}

const s3Instance = new S3();

export default s3Instance;
