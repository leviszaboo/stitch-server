import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { createListing, getListings, getListingById, getListingsByUserId } from "../service/listing.service";
import { CreateListingInput, GetListingByIdInput } from "../schema/listing.schema";
import { ListingInput } from "../models/listing.model";
import NotFoundError from "../errors/global/NotFoundError";
import { GetUserByIdInput } from "../schema/user.schema";
import { uploadImageToS3 } from "../aws/s3";
import { insertImage } from "../service/image.service";

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
        const listings = await getListings()

        return res.send(listings)
    } catch(err: any) {
        console.log(err)
        res.sendStatus(500);
    }
}

export async function createListingHandler(req: Request<{}, {}, CreateListingInput['body']>, res: Response) {
    try {
        const userId = res.locals.user.userId;
        const listingId = uuidv4();
        const body = req.body;
        const files = req.files as Express.Multer.File[];
        
        const uploadPromises = files.map(async (file) => {
            const s3_key = await uploadImageToS3(file);
            await insertImage({
                s3_key,
                listing_id: listingId
            });
        });

        await Promise.all(uploadPromises);

        const input: ListingInput = {
            ...body,
            category_id: +body.category_id,
            price: +body.price,
            listing_id: listingId,
            user_id: userId, 
            listing_date: new Date()
        }

        await createListing(input);

        return res.sendStatus(200);
    } catch (err: any) {
        res.status(409).send(err.message);
    }
}
