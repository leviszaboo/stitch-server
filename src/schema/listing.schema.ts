import { object, number, string, TypeOf, array } from "zod";

const payload = {
    body: object({
        title: string({
            required_error: "Title is required."
        }),
        description: string({
            required_error: "Description is required."
        }),
        size: string({
            required_error: "Size is required"
        }),
        brand: string({
            required_error: "Brand is required"
        }),
        item_condition: string({
            required_error: "Condition is required"
        }),
        price: string({
            required_error: "Price is required"
        }),
        category_id: string({
            required_error: "Category is required"
        }),
    })
}

const files = {
    files: object({
        fieldname: string(),
        originalname: string(),
        encoding: string(),
        mimetype: string(),
        size: number(),
    }).array()
}

const params = {
    params: object({
        listing_id: string({
            required_error: "Listing ID is required."
        })
    })
}

export const createListingSchema = object({ ...payload, ...files })

export const getListingByIdSchema = object({ ...params })

export type GetListingByIdInput = TypeOf<typeof getListingByIdSchema>;
export type CreateListingInput = TypeOf<typeof createListingSchema>;