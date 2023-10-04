import { Request, Response, NextFunction } from "express";
import { createUser, loginUser } from "../service/user.service";
import { CreateUserInput, LoginUserInput } from "../schema/user.schema";

export async function loginUserHandler(req: Request<{}, {}, LoginUserInput['body']>, res: Response) {
    try {
        const user = await loginUser(req.body)
        return res.send(user)
    } catch(err: any) {
        return res.status(409).send(err.message)
    }
}

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try {
        const user = await createUser(req.body);
        return res.send(user);
    } catch(err: any) {
        return res.status(409).send(err.message)
    }
}