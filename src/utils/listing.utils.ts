import { Listing, ListingReturnData } from "../models/listing.model";

export function createListingReturnObject(queryResult: ListingReturnData[]) {
    const set = new Set(queryResult.map(result => result.listing_id));

    if (set.size > 1) { 
        const listings: Listing[] = [];

        queryResult.forEach((result) => {
            const existingListing = listings.find((listing) => listing.listing_id === result.listing_id);
            if (existingListing) {
                existingListing.imageUrls.push(result.image_url);
            } else {
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
                    imageUrls: [result.image_url],
                });
            }
        });

        return listings
    } else {
        const listing: Listing = {
            listing_id: queryResult[0].listing_id,
            title: queryResult[0].title,
            description: queryResult[0].description,
            size: queryResult[0].size,
            brand: queryResult[0].brand,
            price: queryResult[0].price,
            item_condition: queryResult[0].item_condition,
            category_id: queryResult[0].category_id,
            user_id: queryResult[0].user_id,
            listing_date: queryResult[0].listing_date,
            imageUrls: queryResult.map((result) => result.image_url),
        };

        return listing
    }
}