import express from "express";
import 'dotenv/config'
import routes from "./routes";

const port = process.env.PORT

const app = express();

app.use(express.json())

app.listen(port, () => {
    console.log(`App is running on port ${port}`)

    routes(app)
})