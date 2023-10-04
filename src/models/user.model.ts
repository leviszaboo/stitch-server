import { RowDataPacket } from "mysql2";

export interface UserInput {
    email: string,
    password: string
}

export interface User extends RowDataPacket {
    userId: number,
    email: string,
    passwordHash: string
}