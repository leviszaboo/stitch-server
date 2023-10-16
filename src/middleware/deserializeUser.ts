import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import { reissueAccessToken } from "../service/user.service";
import { setRefreshToken } from "../utils/setRefreshToken";

export async function deserializeUser(req: Request, res: Response, next: NextFunction) {
    const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );

    const refreshToken = req.cookies.jwt
    
    if (!accessToken) {
        return next();
    }

    const { decoded, expired } = verifyJwt(accessToken, "access");

    if (decoded) {
        res.locals.user = decoded;
        return next();
    }

    if (expired && refreshToken) {
        const { newAccessToken, newRefreshToken } = await reissueAccessToken(refreshToken);

        if (!newAccessToken || !newRefreshToken) {
            return next()
        }

        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        setRefreshToken(res, newRefreshToken);
    }

    return next()
}