import mysql from "mysql2"
import config from "config"

const pool = mysql.createPool({
    host: config.get<string>("dbHost"),
    user: config.get<string>("dbUser"),
    password: config.get<string>("dbPassword"),
    database: config.get<string>("dbName")
}).promise()

export default pool