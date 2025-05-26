import express from "express"
import cors from "cors"
import { connessioneDb } from "./db.js"
import driversRouter from "./routes/drivers.js"
import calendarRouter from "./routes/calendar.js"

const app = express()

app.use(cors())
app.use(express.json())

let db

// Usa i router
app.use("/drivers", driversRouter)
app.use("/calendar", calendarRouter)

app.listen(3000, async() => {
    try {
        db = await connessioneDb()
        console.log("Connessione riuscita - Server in esecuzione sulla porta 3000");
        
    } catch (error) {
        console.log("Connessione fallita");
    }
})

