import json
from pathlib import Path
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, BulkWriteError
import os
from dotenv import load_dotenv

# Carica le variabili d'ambiente dal file .env nella root
root_dir = Path(__file__).parent.parent
load_dotenv(root_dir / "BackEnd/.env")


def connect_to_mongodb(connection_string=None):
    """
    Stabilisce la connessione con MongoDB
    """
    if connection_string is None:
        connection_string = os.getenv("MONGODB_CONNECTION_STRING")
    
    try:
        client = MongoClient(connection_string)
        # Verifica la connessione
        client.admin.command('ping')
        print("✓ Connessione a MongoDB stabilita con successo")
        return client
    except ConnectionFailure as e:
        print(f"✗ Errore di connessione a MongoDB: {e}")
        return None

def create_indexes(db):
    """
    Crea gli indici necessari per le collezioni
    """
    try:
        # Indici per la collezione seasons
        db.seasons.create_index("year", unique=True)
        db.seasons.create_index("season_id", unique=True)
        
        # Indici per la collezione races
        db.races.create_index([("season_year", 1), ("race_id", 1)], unique=True)
        db.races.create_index("stage_id", unique=True)
        
        # Indici per la collezione drivers
        db.drivers.create_index("driver_id", unique=True)
        db.drivers.create_index("name")
        db.drivers.create_index("nationality")
        
        print("✓ Indici creati con successo")
    except Exception as e:
        print(f"✗ Errore nella creazione degli indici: {e}")

def load_json_file(filepath):
    """
    Carica un file JSON
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"✗ Errore nel caricamento di {filepath}: {e}")
        return None

def adapt_season_data(season_data):
    """
    Adatta i dati della stagione al formato MongoDB
    """
    return {
        "_id": ObjectId(),  # Genera un nuovo ObjectId
        "year": season_data["id"],
        "season_id": season_data["season_id"],
        "description": season_data["description"],
        "total_races": season_data["total_races"],
        "generated_at": season_data.get("generated_at"),
        "season_info": season_data.get("season_info", {}),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

def adapt_race_data(race_data, season_year):
    """
    Adatta i dati della gara al formato MongoDB
    """
    # Estrai i riferimenti ai piloti dal percorso corretto
    driver_refs = []
    competitors = []
    # Cerca i piloti in complete_details.stage.competitors
    complete_details = race_data.get("complete_details", {})
    if complete_details:
        stage = complete_details.get("stage", {})
        if stage:
            competitors = stage.get("competitors", [])
    for competitor in competitors:
        if competitor.get("id"):
            driver_refs.append({
                "driver_id": competitor["id"],
                "name": competitor.get("name"),
                "position": competitor.get("result", {}).get("position"),
                "points": competitor.get("result", {}).get("points"),
                "car_number": competitor.get("result", {}).get("car_number")
            })
    return {
        "_id": ObjectId(),  # Genera un nuovo ObjectId
        "race_id": race_data["id"],
        "stage_id": race_data["stage_id"],
        "season_year": season_year,
        "description": race_data["description"],
        "scheduled": race_data.get("scheduled"),
        "scheduled_end": race_data.get("scheduled_end"),
        "status": race_data.get("status"),
        "type": race_data.get("type"),
        "venue": race_data.get("venue", {}),
        "drivers": driver_refs,
        "race_result": race_data.get("race_result", {}),
        "statistics": race_data.get("statistics", {}),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

def adapt_driver_data(driver_data):
    """
    Adatta i dati del pilota al formato MongoDB
    """
    return {
        "_id": ObjectId(),  # Genera un nuovo ObjectId
        "driver_id": driver_data["id"],
        "name": driver_data["name"],
        "gender": driver_data.get("gender"),
        "nationality": driver_data.get("nationality"),
        "country_code": driver_data.get("country_code"),
        "car_number": driver_data.get("car_number"),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

def save_to_mongodb(db, collection_name, data):
    """
    Salva i dati in MongoDB usando operazioni bulk
    """
    try:
        collection = db[collection_name]
        # Rimuovi tutti i documenti esistenti
        collection.delete_many({})
        # Inserisci i nuovi documenti
        if data:
            result = collection.insert_many(data)
            print(f"✓ Inseriti {len(result.inserted_ids)} documenti in {collection_name}")
        else:
            print(f"! Nessun dato da inserire in {collection_name}")
    except BulkWriteError as e:
        print(f"✗ Errore durante l'inserimento in {collection_name}: {e}")
    except Exception as e:
        print(f"✗ Errore imprevisto durante l'inserimento in {collection_name}: {e}")

def create_mongodb_collections():
    """
    Crea le collezioni MongoDB dai dati estratti
    """
    print("=== Adattamento Dati per MongoDB ===\n")
    
    # Connetti a MongoDB
    client = connect_to_mongodb()
    if not client:
        return
    
    # Seleziona il database
    db = client.indycar
    
    # Crea gli indici
    create_indexes(db)
    
    # Carica i file dei dati
    seasons_data = []
    races_data = []
    drivers_data = []
    
    # Carica i dati delle stagioni
    print("\n1. Caricamento dati stagioni...")
    season_files = sorted(Path("Data/extracted").glob("season_*.json"))
    for file in season_files:
        season = load_json_file(file)
        if season:
            seasons_data.append(adapt_season_data(season))
            # Estrai le gare
            for race in season.get("races", []):
                races_data.append(adapt_race_data(race, season["id"]))
    
    # Carica i dati dei piloti
    print("2. Caricamento dati piloti...")
    drivers_file = Path("Data/extracted/drivers.json")
    if drivers_file.exists():
        drivers = load_json_file(drivers_file)
        if drivers:
            drivers_data = [adapt_driver_data(driver) for driver in drivers]
    
    # Carica i dati in MongoDB
    print("\n3. Caricamento dati in MongoDB...")
    save_to_mongodb(db, "seasons", seasons_data)
    save_to_mongodb(db, "races", races_data)
    save_to_mongodb(db, "drivers", drivers_data)
    
    print("\n=== Adattamento e caricamento completati ===")
    print(f"\nStatistiche:")
    print(f"- Stagioni: {len(seasons_data)}")
    print(f"- Gare: {len(races_data)}")
    print(f"- Piloti: {len(drivers_data)}")
    
    # Chiudi la connessione
    client.close()
    print("\nConnessione a MongoDB chiusa")

if __name__ == "__main__":
    create_mongodb_collections() 