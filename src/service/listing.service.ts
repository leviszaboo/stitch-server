import { ResultSetHeader } from "mysql2";
import pool from "../utils/connect";
import { Listing, ListingInput, ListingReturnData } from "../models/listing.model";
import NotFoundError from "../errors/NotFoundError";
import { createListingReturnObject } from "../utils/listing.utils";

export async function getAllListings(): Promise<Listing | Listing[]> {
    try {
        const [results] = await pool.query<ListingReturnData[]>(
            `SELECT listings.*, images.image_url
            FROM listings
            LEFT JOIN images ON listings.listing_id = images.listing_id
            ORDER BY listings.listing_date DESC;`
        );

        const listings = createListingReturnObject(results)

        return listings;
    } catch (err: any) {
        throw new Error(err);
    }
}

export async function getListingById(id: string): Promise<Listing | Listing[]> {
    try {
        const [results] = await pool.query<ListingReturnData[]>(
            `SELECT listings.*, images.image_url
            FROM listings
            LEFT JOIN images ON listings.listing_id = images.listing_id
            WHERE listings.listing_id = ?`,
            [id]
        );

        if (!results || results.length === 0) {
            throw new NotFoundError("Listing not found");
        }

        const listing = createListingReturnObject(results)

        return listing;
    } catch (err: any) {
        if (err instanceof NotFoundError) {
            throw err;
        } else {
            throw new Error(err);
        }
    }
}


export async function getListingsByUserId(userId: string): Promise<Listing | Listing[]> {
    try {
        const [results] = await pool.query<ListingReturnData[]>(
            `SELECT listings.*, images.image_url
            FROM listings
            LEFT JOIN images ON listings.listing_id = images.listing_id
            WHERE listings.user_id = ?`,
            [userId]
        );

        if (!results || results.length === 0) {
            throw new NotFoundError("Listings not found");
        }

        const listings = createListingReturnObject(results)

        return listings;
    } catch (err: any) {
        if (err instanceof NotFoundError) {
            throw err;
        } else {
            throw new Error(err);
        }
    }
}
    

export async function createListing(input: ListingInput) {
    try {
        const listing_id = Date.now().toString()

        const values = [
            listing_id,
            input.title,
            input.description,
            input.size,
            input.brand,
            input.item_condition,
            input.price,
            input.user_id,
            input.listing_date,
            input.category_id 
        ]
    
        const [listingInsertResult] = await pool.query<ResultSetHeader>(
            `INSERT INTO listings (
                listing_id,
                title,
                description,
                size,
                brand,
                item_condition,
                price,
                user_id,
                listing_date,
                category_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            values
        )

        if (listingInsertResult.affectedRows === 1) {
            const newlyCreatedListing = await getListingById(listing_id)

            if (newlyCreatedListing) {
                return newlyCreatedListing
            } else {
                throw new Error("Failed to retrieve listing.")
            }
        } else {
            throw new Error("Failed to create listing.")
        }
    } catch (err: any) {
        throw new Error(err)
    }
}