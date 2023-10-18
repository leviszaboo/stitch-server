import "dotenv/config";

export default {
    port: process.env.PORT,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    s3BucketName: process.env.BUCKET_NAME,
    s3BucketRegion: process.env.BUCKET_REGION,
    s3AccessKey: process.env.ACCESS_KEY,
    s3SecretAccessKey: process.env.SECRET_ACCESS_KEY,
    jwtAccessPrivateKey: process.env.ACT_PRIVATE_KEY,
    jwtRefreshPrivateKey: process.env.REFRESH_PRIVATE_KEY,
    jwtAccessPublicKey: process.env.ACT_PUBLIC_KEY,
    jwtRefreshPublicKey: process.env.REFRESH_PUBLIC_KEY
}