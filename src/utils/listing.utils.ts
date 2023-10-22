import { getImageUrl } from "../aws/s3";
import { Listing, ListingReturnData } from "../models/listing.model";

export async function createListingReturnObject(queryResult: ListingReturnData[]) {
    if (queryResult.length === 0) {
        return []
    }

    const set = new Set(queryResult.map(result => result.listing_id));
    console.log(queryResult)
    if (set.size > 1) { 
        try {
            const listings: Listing[] = [];

            queryResult.forEach(async (result) => {
                const existingListing = listings.find((listing) => listing.listing_id === result.listing_id);

                const url = await getImageUrl(result.s3_key);

                if (existingListing) {
                    existingListing.imageUrls.push(url);
                } else {
                    const url = await getImageUrl(result.s3_key)
                    listings.push({
                        listing_id: result.listing_id,
                        title: result.title,
                        description: result.description,
                        size: result.size,
                        brand: result.brand,
                        price: result.price,
                        item_condition: result.item_condition,
                        category_id: result.category_id,
                        user_id: result.user_id,
                        listing_date: result.listing_date,
                        imageUrls: [url],
                    });
                }
            });

            return listings
        } catch(err: any) {
            throw new Error(err)
        }
    } else {
        try {
            const result = queryResult[0];
            const urlPromises = queryResult.map(async (row) => {
                const url = await getImageUrl(row.s3_key)
                return url
            })

            const urls = await Promise.all(urlPromises);

            const listing: Listing = {
                listing_id: result.listing_id,
                title: result.title,
                description: result.description,
                size: result.size,
                brand: result.brand,
                price: result.price,
                item_condition: result.item_condition,
                category_id: result.category_id,
                user_id: result.user_id,
                listing_date: result.listing_date,
                imageUrls: urls,
            };

            return listing
        } catch(err: any) {
            throw new Error(err)
        }
    }
}