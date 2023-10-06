import express from "express";
import 'dotenv/config'
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";

const port = process.env.PORT

const app = express();

app.use(express.json())

app.use(deserializeUser)

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)

    routes(app)
})