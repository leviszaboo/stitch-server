import { object, number, string, TypeOf } from "zod";

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
            required_error: "Size is required"
        }),
        item_condition: string({
            required_error: "Size is required"
        }),
        price: number({
            required_error: "Size is required"
        }),
        category_id: number({
            required_error: "Size is required"
        }),
    })
}

const params = {
    params: object({
        listing_id: string({
            required_error: "Listing ID is required."
        })
    })
}

export const createListingSchema = object({ ...payload })

export const getListingByIdSchema = object({ ...params })

export type GetListingByIdInput = TypeOf<typeof getListingByIdSchema>;
export type CreateListingInput = TypeOf<typeof createListingSchema>;