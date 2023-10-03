import { RowDataPacket } from "mysql2";

export interface UserInput {
    email: string,
    password: string
}

export default interface User extends RowDataPacket {
    userId: number,
    email: string,
    password: string
}