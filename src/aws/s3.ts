import { 
    GetObjectCommand, 
    GetObjectCommandInput, 
    PutObjectCommand, 
    PutObjectCommandInput, 
    S3Client 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import config from "config";

const s3BucketName = config.get<string>("s3BucketName");
const s3BucketRegion = config.get<string>("s3BucketRegion");
const s3AccessKey = config.get<string>("s3AccessKey");
const s3SecretAccessKey = config.get<string>("s3SecretAccessKey");

const s3 = new S3Client({
    region: s3BucketRegion,
    credentials: {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretAccessKey
    }
})

export async function uploadImageToS3(file: Express.Multer.File) {
    try {   
        const key = uuidv4();

        const params: PutObjectCommandInput = {
            Bucket: s3BucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        }
    
        const command = new PutObjectCommand(params)
    
        await s3.send(command);

        return key
    } catch(err: any) {
        console.log(err)
        throw new Error(err)
    }
}

export async function getImageUrl(key: string) {
    try {
        const params: GetObjectCommandInput = {
            Bucket: s3BucketName,
            Key: key
        }

        const command = new GetObjectCommand(params);
        const expiresIn = 800;
        const url = await getSignedUrl(s3, command, {
            expiresIn: expiresIn
        })

        return url
    } catch(err: any) {
        throw new Error(err)
    }
}