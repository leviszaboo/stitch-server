import { RowDataPacket } from "mysql2";

export interface ListingInput {
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

export interface ListingTextData extends RowDataPacket, ListingInput {
    listing_id: string; 
}

export interface ListingReturnData extends ListingTextData {
    image_url: string
}

export interface Listing extends ListingInput {
    listing_id: string; 
    imageUrls: string[]; 
}
