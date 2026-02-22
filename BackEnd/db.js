import dotenv from "dotenv"
import {MongoClient} from "mongodb"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, ".env") })
dotenv.config()

export async function connessioneDb(){
    const uri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING

    if (!uri) {
        throw new Error("Variabile MongoDB mancante: usa MONGODB_URI o MONGODB_CONNECTION_STRING")
    }

    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 8000
    })

    try {
        await client.connect()
        return client.db("indycar")
    } catch (error) {
        console.log("Connessione fallita", error)
        throw error
    }
}

