import { RowDataPacket } from "mysql2";

export interface ListingInput extends RowDataPacket {
    title: string;
    description: string;
    size: string;
    brand: string;
    item_condition: string;
    price: number;
    is_sold: boolean; 
    listing_date: Date; 
    category_id: string;
}

export interface Listing extends RowDataPacket {
    listing_id: string; 
    title: string;
    description: string;
    size: string;
    brand: string;
    item_condition: string;
    price: number;
    user_id: string; 
    is_sold: boolean; 
    listing_date: Date; 
    category_id: string;
}
