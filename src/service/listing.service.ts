import { ResultSetHeader } from "mysql2";
import pool from "../utils/connect";
import { Listing, ListingInput } from "../models/listing.model";
import NotFoundError from "../errors/NotFoundError";

export async function getAllListings() {
    try {
        const [listings] = await pool.query<Listing[]>(
            `SELECT * FROM listings`
        )

        return listings
    } catch(err: any) {
        throw new Error(err)
    }
}

export async function getListingById(id: string) {
    try {
        const [listing] = await pool.query<Listing[]>(
            "SELECT * FROM listings WHERE listing_id = ?",
            [id]
        ) 
        
        if (!listing[0]) {
            throw new NotFoundError("Listing not found")
        }

        return listing[0]

    } catch(err: any) {
        if (err instanceof NotFoundError) {
            throw err
        } else {
            throw new Error(err)
        }
    }
}

export async function getListingsByUserId(userId: string) {
    try {
        const [listings] = await pool.query<Listing[]>(
            "SELECT * FROM listings WHERE user_id = ?",
            [userId]
        ) 

        console.log(listings)

        if (!listings || listings.length === 0) {
            throw new NotFoundError("Listings not found")
        }

        return listings

    } catch(err: any) {
        if (err instanceof NotFoundError) {
            throw err
        } else {
            throw new Error(err)
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
    
        const [listingInsertInput] = await pool.query<ResultSetHeader>(
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

        if (listingInsertInput.affectedRows === 1) {
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