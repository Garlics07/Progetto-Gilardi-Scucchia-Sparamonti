import express from "express"
import cors from "cors"
import {connessioneDb, getAll, getById} from "./db.js"

const app = express()

app.use(cors())
app.use(express.json())

let db

app.get("/", async(req, res) => {
    res.send("home")
})

app.listen(3000, async() => {
    try {
        db = await connessioneDb()
        console.log("Connessione riuscita - Server in esecuzione sulla porta 3000");
        
    } catch (error) {
        console.log("Connessione fallita");
    }
})