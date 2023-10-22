import { RowDataPacket } from "mysql2";

export interface ListingInput {
    listing_id: string,
    title: string;
    description: string;
    size: string;
    brand: string;
    item_condition: string;
    price: number;
    user_id: string;
    listing_date: Date; 
    category_id: number;
}

export interface ListingReturnData extends ListingInput, RowDataPacket {
    s3_key: string;
}

export interface Listing extends ListingInput {
    imageUrls: string[]; 
}
