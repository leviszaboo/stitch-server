import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config"

const accessTokenPrivateKey = process.env.ACT_PUBLIC_KEY!;
const accessTokenPublicKey = process.env.ACT_PUBLIC_KEY!;
const refreshTokenPrivateKey = process.env.REFRESH_PRIVATE_KEY!;
const refreshTokenPublicKey = process.env.REFRESH_PRIVATE_KEY!;

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
      } catch (e: any) {
        console.error(e);
        return {
            valid: false,
            expired: e.message === "jwt expired",
            decoded: null,
        };
    }
}