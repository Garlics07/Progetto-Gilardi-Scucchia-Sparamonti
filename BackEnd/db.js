import dotenv from "dotenv"
import {MongoClient} from "mongodb"

dotenv.config()

export async function getAll(db, nomeCollezione){
    const data = await db.collection(nomeCollezione).find().toArray()
    return data
}

//cliente con id 1, il campo si chiama id_cliente
export async function getById(db, nomeCollezione, id){
    const data = await db.collection(nomeCollezione).findOne({id_cliente: id})
    return data
}

export async function connessioneDb(){
    const uri = process.env.MONGODB_URI
    const client = new MongoClient(uri)
    try {
        await client.connect()
        return client.db(//nome del db)
    } catch (error) {
        console.log("Connessione fallita", error);
    }
}