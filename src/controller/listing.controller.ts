import { Request, Response } from "express";
import { createListing, getAllListings, getListingById, getListingsByUserId } from "../service/listing.service";
import { CreateListingInput, GetListingByIdInput } from "../schema/listing.schema";
import { ListingInput } from "../models/listing.model";
import NotFoundError from "../errors/NotFoundError";
import { GetUserByIdInput } from "../schema/user.schema";

export async function getListingByIdHandler(req: Request<GetListingByIdInput['params']>, res: Response) {
    try {
        const listingId = req.params.listing_id 
        const listing = await getListingById(listingId);

        return res.send(listing)
    } catch(err: any) {
        if (err instanceof NotFoundError) {
            res.status(404).send(err.message)
        } else {
            res.sendStatus(500)
        }
    }
}

export async function getListingsByUserIdHandler(req: Request<GetUserByIdInput['params']>, res: Response) {
    try {
        const userId = req.params.user_id
        const listings = await getListingsByUserId(userId);

        return res.send(listings)
    } catch(err: any) {
        if (err instanceof NotFoundError) {
            res.status(404).send(err.message)
        } else {
            res.sendStatus(500)
        }
    }
}

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

        //axios.post(/api/images, images)

        await createListing(input)

        return res.sendStatus(200)
    } catch (err: any) {
        res.status(409).send(err.message)
    }
}