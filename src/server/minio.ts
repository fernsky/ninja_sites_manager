import dotenv from "dotenv";
import * as Minio from "minio";
import { env } from "@/env";

dotenv.config();
console.log(env.MINIO_ENDPOINT, env.MINIO_PORT, env.MINIO_CLIENT_ACCESS_KEY, env.MINIO_CLIENT_SECRET_KEY, env.MINIO_USE_SSL);
// Ensure the environment variables are set
export const minio = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  accessKey: env.MINIO_CLIENT_ACCESS_KEY,
  secretKey: env.MINIO_CLIENT_SECRET_KEY,
  useSSL: env.MINIO_USE_SSL,
});
