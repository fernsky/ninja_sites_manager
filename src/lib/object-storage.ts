import dotenv from "dotenv";
import * as Minio from "minio";

dotenv.config();

/* Bootstrap the persistent minio Client */
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000", 10),
  accessKey: process.env.MINIO_ACCESS_KEY || "2EpLIPxSc3ET9oxGESIo",
  secretKey:
    process.env.MINIO_SECRET_KEY || "XX6f9FYdc6ToDMtqgiyOb7EtucNG1KJPrDoCFb1U",
  useSSL: process.env.MINIO_USE_SSL === "true",
});

/* Upload a single object to minio */
export const uploadObject = async (
  bucket: string,
  key: string,
  data: Buffer,
) => {
  const exists = await minioClient.bucketExists(bucket);
  if (!exists) {
    throw new Error(`Bucket ${bucket} does not exist.`);
  }

  await minioClient.putObject(bucket, key, data);
};

/* Delete an object from the bucket */
export const deleteObject = async (bucket: string, key: string) => {
  await minioClient.removeObject(bucket, key);
};

/* Get an object from the bucket */
export const getObject = async (
  bucket: string,
  key: string,
): Promise<Buffer> => {
  const object = await minioClient.getObject(bucket, key);
  // Ensure object is a readable stream
  if (!object || typeof object.pipe !== "function") {
    throw new Error("Object is not a readable stream");
  }

  // Collect all the data from the stream
  const chunks: Buffer[] = [];
  for await (const chunk of object) {
    chunks.push(chunk);
  }

  // Combine all chunks into a single Buffer
  const bufferData = Buffer.concat(chunks);

  return bufferData;
};
