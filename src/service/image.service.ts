import { ResultSetHeader } from "mysql2"
import NotFoundError from "../errors/NotFoundError"
import { Image, ImageInput } from "../models/image.model"
import pool from "../utils/connect"

export async function insertImage(input: ImageInput) {
    const values = [
        input.image_url,
        input.listing_id
    ]

    try {
        const [imageInsertResult] = await pool.query<ResultSetHeader>(
            "INSERT INTO IMAGES (?, ?)",
            values
        )

        if (imageInsertResult.affectedRows === 1) {
            return true
        } else {
            throw new Error("Failed to create image.")
        }
    } catch(err: any) {
        throw new Error(err);
    }
}
