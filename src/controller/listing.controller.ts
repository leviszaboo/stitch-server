import { Request, Response } from "express";
import { getAllListings } from "../service/listing.service";

export async function getAllListingsHandler(req: Request, res: Response) {
    try {
        const listings = await getAllListings()
        return res.send(listings)
    } catch(err: any) {
        res.status(500).send(err.message)
    }
}