import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";
import config from "config";

const port = config.get<number>("port");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(deserializeUser);
console.log(port)
app.listen(port, () => {
    console.log("hello")
    console.log(`App is running on http://localhost:${port}`);

    routes(app);
})