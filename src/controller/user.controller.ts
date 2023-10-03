import { Request, Response, NextFunction } from "express";
import { createUser } from "../service/users.service";
import { CreateUserInput } from "../schema/user.schema";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response, next: NextFunction) {
    try {
        const user = await createUser(req.body);
        return res.send(user);
    } catch(err: any) {
        
        return res.status(409).send(err.message)
    }
}