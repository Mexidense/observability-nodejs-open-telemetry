import { S3 } from '@aws-sdk/client-s3';

export class AwsS3PublisherService {
  constructor(
    private readonly s3Client: S3,
    private readonly bucketName: string,
  ) {}

  public async pushFile(report: string): Promise<string> {
    const fileKey = `${new Date().getTime()}.json`;

    console.log(
      `[${new Date().toISOString()}][AWSS3] Publishing report...`,
      fileKey,
    );

    try {
      await this.s3Client.putObject({
        Bucket: this.bucketName,
        Key: fileKey,
        ContentType: 'application/json',
        Body: report,
        ACL: 'public-read',
      });
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}][AWSS3] Error publishin report...`,
        error,
      );
    }

    return fileKey;
  }
}
