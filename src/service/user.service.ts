import { ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt"
import { UserInput, User } from "../models/user.model";
import pool from "../utils/connect";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import NotFoundError from "../errors/NotFoundError";

export async function getUserById(id: string) {
    try {
        const [user] = await pool.query<User[]>(
            "SELECT * FROM users WHERE user_id = ?",
            [id]
        ) 

        if (!user[0]) {
            throw new NotFoundError("User not found")
        }

        return { user_id: user[0].user_id, email: user[0].email }

    } catch(err: any) {
        if (err instanceof NotFoundError) {
            throw err
        } else {
            throw new Error(err)
        }
    }
}

export async function getUserByEmail(email: string) {
    try {
        const [user] = await pool.query<User[]>(
            "SELECT * FROM users WHERE email = ?",
            [email]
        ) 

        if (!user[0]) {
            throw new NotFoundError("User not found")
        }

        return user[0]

    } catch(err: any) {
        if (err instanceof NotFoundError) {
            throw err
        } else {
            throw new Error(err)
        }
    }
}

interface AuthResponse {
    user: {
      userId: string;
      email: string;
    };
    accessToken: string;
    refreshToken: string;
  }

export async function loginUser(input: UserInput): Promise<AuthResponse> {
    try {
        const user = await getUserByEmail(input.email)

        console.log(user)

        if (!user) {
            throw new NotFoundError("User not found.")
        }

        const passwordMatch = await bcrypt.compare(input.password, user.passwordHash)

        if (!passwordMatch) {
            throw new Error("Incorrect password.")
        }

        const token = signJwt(
            { 
                userId: user.user_id, email: user.email
            }, 
            "access",
            {
                expiresIn: "5m"
            }
        )

        const refreshToken = signJwt(
            { userId: user.user_id }, 
            "refresh",
            {
                expiresIn: "30m"
            }
        )

        return { 
            user: { 
                userId: user.user_id, 
                email: user.email 
            }, 
            accessToken: token, 
            refreshToken: refreshToken
        }

    } catch (err: any) {
        if (err instanceof NotFoundError) {
            throw err
        } else {
            throw new Error(err)
        }
    }
}

export async function createUser(input: UserInput) {
    try {
        const existingUser = await getUserByEmail(input.email)
        
        const id = Date.now().toString()
    
        if (existingUser) {
            throw new Error("User already exists.")
        }

        const passwordHash = await bcrypt.hash(input.password, 10)
    
        const [userInsertResult] = await pool.query<ResultSetHeader>(
            "INSERT INTO users VALUES (?, ?, ?)",
            [id, input.email, passwordHash]
        )
    
        if (userInsertResult.affectedRows === 1) {
            const newlyCreatedUser = await getUserByEmail(input.email)

            if (newlyCreatedUser) {
               return { user_id: newlyCreatedUser.user_id, email: newlyCreatedUser.email }
            } else {
                throw new Error("Failed to retrieve the user.");
            }
        } else {
            throw new Error("Failed to insert the user.");
        }
    } catch (err: any) {
        throw new Error(err)
    }
}   

export async function reissueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = verifyJwt(refreshToken, "refresh");

    if (!decoded) return { 
        newAccessToken: null,
        newRefreshToken: null
    };

    const user = await getUserById(decoded.userId);

    if (!user) return { 
        newAccessToken: null,
        newRefreshToken: null
    }

    const newRefreshToken = signJwt(
        { userId: user.user_id }, 
        "refresh",
        {
            expiresIn: "30m"
        }
    )
    
    const newAccessToken = signJwt(
        { userId: user.user_id, email: user.email}, 
        "access",
        { 
            expiresIn: "5m" 
        }
    )

    return { 
        newAccessToken: newAccessToken,
        newRefreshToken: newRefreshToken
    }
}