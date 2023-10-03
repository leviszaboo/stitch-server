import { ResultSetHeader, RowDataPacket } from "mysql2";
import { UserInput } from "../models/user.model";
import pool from "../utils/connect";

export async function createUser(input: UserInput) {
    try {
        const [existingUser] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM users WHERE email = ?",
            [input.email]
        )
    
        const id = Date.now()
    
        if (existingUser.length > 0) {
            throw new Error("User already exists.")
        }
    
        const [userInsertResult] = await pool.query<ResultSetHeader>(
            "INSERT INTO users VALUES (?, ?, ?)",
            [id, input.email, input.password]
        )
    
        if (userInsertResult.affectedRows === 1) {
            const [newlyCreatedUser] = await pool.query<RowDataPacket[]>(
                "SELECT * FROM users WHERE userId = ?",
                [id]
            );

            if (newlyCreatedUser.length === 1) {
                return {
                    userId: id,
                    email: input.email,
                };
            } else {
                throw new Error("Failed to retrieve the newly created user.");
            }
        } else {
            throw new Error("Failed to insert the user.");
        }
    } catch (err: any) {
        throw new Error(err)
    }
}   