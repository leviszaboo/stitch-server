import express from "express";
import 'dotenv/config'
import connect from "./utils/connect";

const port = process.env.PORT

const app = express();

app.use(express.json())

app.listen(port, () => {
    console.log(`App is running on port ${port}`)

    const pool = connect()

    if (pool) console.log("Connected to db")
})