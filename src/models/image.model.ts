import { RowDataPacket } from "mysql2";

export interface ImageInput {
    image_url: string,
    listing_id: string
}

export interface Image extends RowDataPacket, ImageInput {
    
}