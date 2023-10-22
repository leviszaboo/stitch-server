import { Express, Request, Response } from "express"
import { createUserHandler, getUserByIdHandler, loginUserHandler } from "./controller/user.controller"
import validateResource from "./middleware/validateResource"
import { createUserSchema, getUserByIdSchema, loginUserSchema } from "./schema/user.schema"
import { createListingHandler, getAllListingsHandler, getListingByIdHandler, getListingsByUserIdHandler } from "./controller/listing.controller"
import requireUser from "./middleware/requireUser"
import { createListingSchema, getListingByIdSchema } from "./schema/listing.schema"
import multer from 'multer';

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export default function routes(app: Express) {
    app.get("/healthcheck", (_req: Request, res: Response) => res.sendStatus(200));

    app.post("/api/users/register", validateResource(createUserSchema), createUserHandler);

    app.post("/api/users/login", validateResource(loginUserSchema), loginUserHandler);

    app.get("/api/users/:user_id", validateResource(getUserByIdSchema), getUserByIdHandler);

    app.get("/api/users/:user_id/listings", validateResource(getUserByIdSchema), getListingsByUserIdHandler);

    app.get("/api/listings", getAllListingsHandler);

    app.get("/api/listings/:listing_id", validateResource(getListingByIdSchema), getListingByIdHandler);

    app.post("/api/listings", [requireUser, upload.array('images', 12), validateResource(createListingSchema)], createListingHandler);

    app.post("/api/test", upload.array('images', 12), (req, res) => {
        const files = req.files
        console.log(files)
        return res.sendStatus(200)
    })
}