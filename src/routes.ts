import { Express, Request, Response } from "express"
import { createUserHandler, loginUserHandler } from "./controller/user.controller"
import validateResource from "./middleware/validateResource"
import { createUserSchema, loginUserSchema } from "./schema/user.schema"

export default function routes(app: Express) {
    app.get("/healthcheck", (_req: Request, res: Response) => res.sendStatus(200))

    app.post("/api/users/register", validateResource(createUserSchema), createUserHandler)

    app.post("/api/users/login", validateResource(loginUserSchema), loginUserHandler)
}