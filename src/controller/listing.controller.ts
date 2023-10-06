import { Request, Response } from "express";
import { createListing, getAllListings } from "../service/listing.service";
import { CreateListingInput } from "../schema/listing.schema";
import { ListingInput } from "../models/listing.model";

export async function getAllListingsHandler(_req: Request, res: Response) {
    try {
        const listings = await getAllListings()
        return res.send(listings)
    } catch(err: any) {
        res.sendStatus(500);
    }
}

export async function createListingHandler(req: Request<{}, {}, CreateListingInput['body']>, res: Response) {
    try {
        const userId = res.locals.user.userId 

        const body = req.body

        const input: ListingInput = {
            ...body,
            user_id: userId, 
            listing_date: new Date()
        }

        const listing = await createListing(input)

        return res.send(listing)
    } catch (err: any) {
        res.status(409).send(err.message)
    }
}