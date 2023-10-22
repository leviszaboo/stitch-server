import { RowDataPacket } from "mysql2";

export interface ImageInput {
    s3_key: string,
    listing_id: string
}

export interface Image extends RowDataPacket, ImageInput {}  
