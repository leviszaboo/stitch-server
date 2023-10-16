import { Response } from "express";

export function setRefreshToken(res: Response, token: string) {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, 
    });
}