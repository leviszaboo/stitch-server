import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";

export async function deserializeUser(req: Request, res: Response, next: NextFunction) {
    const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );
    
    if (!accessToken) {
        return next();
    }

    const { decoded } = verifyJwt(accessToken);
    console.log(decoded)

    if (decoded) {
        res.locals.user = decoded;
        return next();
    }

    return next()
}