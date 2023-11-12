import { ResultSetHeader } from "mysql2"
import NotFoundError from "../errors/global/NotFoundError"
import { Image, ImageInput } from "../models/image.model"
import pool from "../utils/connect"

export async function getImageByKey(key: string) {
    try {
        const [image] = await pool.query<Image[]>(
            "SELECT * FROM images WHERE s3_key = ?",
            [key]
        ) 

        if (!image[0]) {
            throw new NotFoundError("Image not found")
        }

        return image[0]

    } catch(err: any) {
        if (err instanceof NotFoundError) {
            throw err
        } else {
            throw new Error(err)
        }
    }
}

export async function insertImage(input: ImageInput) {
    const values = [
        input.listing_id,
        input.s3_key
    ]

    try {
        const [imageInsertResult] = await pool.query<ResultSetHeader>(
            `INSERT INTO IMAGES (
                listing_id,
                s3_key
            )
            VALUES (?, ?)`,
            values
        )

        if (imageInsertResult.affectedRows === 1) {
            console.log("image inserted");
            try {
                await getImageByKey(input.s3_key);
            } catch(err: any) {
                throw new Error(err)
            }
        } else {
            throw new Error("Failed to create image.")
        }

    } catch(err: any) {
        if (err instanceof NotFoundError) {
            throw new Error("Failed to retrieve image.")
        }
        throw new Error(err);
    }
}
