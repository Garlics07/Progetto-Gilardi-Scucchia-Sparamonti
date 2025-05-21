import express from "express"
import cors from "cors"
import {connessioneDb, getAll} from "./db.js"

const app = express()

app.use(cors())
app.use(express.json())

let db

//All Pilot

app.get("/AllPilot", async(req, res) => {
    const data = await getAll(db, "Pilot")
    res.send(data)
})

//Calendar

app.get("/Calendar", async(req, res) => {
    const data = await getAll(db, "Calendar")
    res.send(data)
})


app.listen(3000, async() => {
    try {
        db = await connessioneDb()
        console.log("Connessione riuscita - Server in esecuzione sulla porta 3000");
        
    } catch (error) {
        console.log("Connessione fallita");
    }
})