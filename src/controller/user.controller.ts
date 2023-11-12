import { Request, Response } from "express";
import { createUser, getUserById, loginUser } from "../service/user.service";
import { CreateUserInput, GetUserByIdInput, LoginUserInput } from "../schema/user.schema";
import NotFoundError from "../errors/global/NotFoundError";
import UserNotFoundError from "../errors/user/UserNotFoundError";
import IncorrectPasswordError from "../errors/user/IncorrectPasswordError";
import EmailExistsError from "../errors/user/EmailExistsError";
import { setRefreshToken } from "../utils/setRefreshToken";

export async function getUserByIdHandler(req: Request<GetUserByIdInput['params']>, res: Response) {
    try {
        const userId = req.params.user_id
        const user = await getUserById(userId)

        return res.send(user)
    } catch(err: any) {

        if (err instanceof UserNotFoundError) {
            return res.status(404).send({ ...err, message: err.message })
        } 
        
        return res.status(500).send(err.message);
    }
}

export async function loginUserHandler(req: Request<{}, {}, LoginUserInput['body']>, res: Response) {
    try {
        const { user, accessToken, refreshToken } = await loginUser(req.body)
        setRefreshToken(res, refreshToken);

        return res.send({ user, accessToken })
    } catch(err: any) {

        if (err instanceof UserNotFoundError) {
            return res.status(404).send({ ...err, message: err.message });
        } 
        
        if (err instanceof IncorrectPasswordError) {
            return res.status(401).send({ ...err, message: err.message });
        }

        return res.status(500).send(err.message);
    }
}

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try {
        const user = await createUser(req.body);

        return res.send(user);
    } catch(err: any) {

        if (err instanceof EmailExistsError) {
            return res.status(409).send({ ...err, message: err.message})
        } 

        return res.status(500).send(err.message);
    }
}
