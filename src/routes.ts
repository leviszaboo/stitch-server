import { Express, Request, Response } from "express"
import { createUserHandler, loginUserHandler } from "./controller/user.controller"
import validateResource from "./middleware/validateResource"
import { createUserSchema, loginUserSchema } from "./schema/user.schema"
import { getAllListingsHandler } from "./controller/listing.controller"

export default function routes(app: Express) {
    app.get("/healthcheck", (_req: Request, res: Response) => res.sendStatus(200))

    app.post("/api/users/register", validateResource(createUserSchema), createUserHandler)

    app.post("/api/users/login", validateResource(loginUserSchema), loginUserHandler)

    app.get("/api/listings", getAllListingsHandler)

    app.get("/api/listings/:id")

    app.get("api/listings/:userid")

    app.post("api/listings")
}