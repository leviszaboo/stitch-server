import jwt from "jsonwebtoken";

export function signJwt(
    object: Object,
    key: string,
    options?: jwt.SignOptions | undefined
) {
    return jwt.sign(object, key, {
        ...(options && options),
        algorithm: "RS256"
    })
}