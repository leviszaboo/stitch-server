import { Request, Response } from 'express';
import multer from 'multer';
import { S3Client } from "@aws-sdk/client-s3";
import config from "config";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const s3BucketName = config.get<string>("s3BucketName");
const s3BucketRegion = config.get<string>("s3BucketRegion");
const s3AccessKey = config.get<string>("s3AccessKey");
const s3SecretAccessKey = config.get<string>("s3SecretAccessKey");

function uploadImagesHandler(req: Request, res: Response) {
    
}