import { ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt"
import "dotenv/config"
import pool from "../utils/connect";
import { Listing, ListingInput } from "../models/listing.model";

export async function getAllListings() {
    try {
        const [listings] = await pool.query<Listing[]>(
            "SELECT * FROM listings"
        )

        return listings
    } catch(err: any) {
        throw new Error(err)
    }
}

export async function createListing(input: ListingInput) {
    const {
        title,
        description,
        size,
        brand,
        item_condition,
        price,
        is_sold,
        listing_date,
        category_id
    } = input
}