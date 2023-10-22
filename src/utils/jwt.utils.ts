import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";

const accessTokenPrivateKey = config.get<string>("jwtAccessPrivateKey");
const accessTokenPublicKey = config.get<string>("jwtAccessPublicKey");
const refreshTokenPrivateKey = config.get<string>("jwtRefreshPrivateKey");
const refreshTokenPublicKey = config.get<string>("jwtRefreshPrivateKey");

interface UserPayload extends JwtPayload {
    userId: string,
    email: string
}

export function signJwt(
    object: Object,
    tokenType: "refresh" | "access",
    options?: jwt.SignOptions | undefined,
) {
    const key = tokenType === "access" ? accessTokenPrivateKey : refreshTokenPrivateKey;
    return jwt.sign(object, key, {
        ...(options && options),
        algorithm: "RS256"
    })
}

export function verifyJwt(token: string, tokenType: "refresh" | "access",) {
    try {
        const key = tokenType === "access" ? accessTokenPublicKey : refreshTokenPublicKey; 
        const decoded = jwt.verify(token, key) as UserPayload
        return {
            valid: true,
            expired: false,
            decoded,
        };
      } catch (err: any) {
        console.log("jwt verification error: ", err);
        return {
            valid: false,
            expired: err.message === "jwt expired",
            decoded: null,
        };
    }
}