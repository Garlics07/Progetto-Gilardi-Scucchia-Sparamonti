import dotenv from "dotenv"
import {MongoClient} from "mongodb"

dotenv.config()

export async function connessioneDb(){
    const uri = process.env.MONGODB_URI
    const client = new MongoClient(uri)
    try {
        await client.connect()
        return client.db("indycar")
    } catch (error) {
        console.log("Connessione fallita", error);
    }
}

