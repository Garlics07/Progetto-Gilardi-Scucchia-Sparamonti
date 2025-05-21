import requests
import json
from pathlib import Path
import time
import os
from dotenv import load_dotenv

# Carica le variabili d'ambiente dal file .env nella root
root_dir = Path(__file__).parent.parent.parent
load_dotenv(root_dir / "BackEnd/.env")


# Configurazione API
BASE_URL = os.getenv("SPORTRADAR_BASE_URL", "https://api.sportradar.com/indycar/trial/v2/en")
API_KEY = os.getenv("SPORTRADAR_API_KEY")

# Crea la directory per i dati estratti
Path("Data/extracted").mkdir(parents=True, exist_ok=True)

HEADERS = {
    "accept": "application/json",
    "x-api-key": API_KEY
}

def load_seasons():
    """
    Carica la lista delle stagioni dal file JSON
    """
    try:
        with open("Data/extracted/seasons.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"✗ Errore nel caricamento delle stagioni: {e}")
        return []

def fetch_data(url: str, retry_count=3, delay=1):
    """
    Funzione sincrona per recuperare dati da un URL dato con retry.
    """
    print(f"Tentativo di recupero dati da: {url}")
    
    for attempt in range(retry_count):
        try:
            response = requests.get(url, headers=HEADERS)
            response.raise_for_status()
            data = response.json()
            print(f"✓ Dati recuperati con successo da {url}")
            return data
                
        except requests.exceptions.RequestException as e:
            status_code = getattr(response, 'status_code', 'N/A') if 'response' in locals() else 'N/A'
            response_text = getattr(response, 'text', 'N/A') if 'response' in locals() else 'N/A'
            print(f"✗ Tentativo {attempt + 1}/{retry_count} fallito per {url}. Stato HTTP: {status_code}. Errore: {e}")
            
            if status_code == 429:  # Rate limit
                wait_time = delay * (attempt + 1)
                print(f"Rate limit raggiunto. Attendo {wait_time} secondi...")
                time.sleep(wait_time)
                continue
                
            if attempt < retry_count - 1:
                time.sleep(delay)
                continue
                
            if status_code != 'N/A':
                print(f"Corpo della risposta: {response_text[:500]}...")
            return None
            
        except Exception as e:
            print(f"✗ Errore imprevisto durante il recupero da {url}: {e}")
            if attempt < retry_count - 1:
                time.sleep(delay)
                continue
            return None

def fetch_race_details(race_id):
    """
    Recupera i dettagli completi di una gara specifica
    """
    url = f"{BASE_URL}/sport_events/{race_id}/summary.json"
    return fetch_data(url)

def clean_race_data(race_data):
    """
    Pulisce i dati di una gara eliminando duplicazioni e dati non necessari
    """
    # Rimuovi duplicati dai competitors
    if "competitors" in race_data:
        unique_competitors = {}
        for competitor in race_data["competitors"]:
            comp_id = competitor.get("id")
            if comp_id and comp_id not in unique_competitors:
                unique_competitors[comp_id] = competitor
        race_data["competitors"] = list(unique_competitors.values())

    # Rimuovi duplicati dagli stages
    if "stages" in race_data:
        unique_stages = {}
        for stage in race_data["stages"]:
            stage_id = stage.get("id")
            if stage_id and stage_id not in unique_stages:
                unique_stages[stage_id] = stage
        race_data["stages"] = list(unique_stages.values())

    # Rimuovi dati duplicati dal complete_details
    if "complete_details" in race_data:
        details = race_data["complete_details"]
        # Rimuovi i dati che sono già presenti nel livello principale
        keys_to_remove = ["id", "description", "scheduled", "scheduled_end", "type", 
                         "status", "venue", "competitors", "stages"]
        for key in keys_to_remove:
            if key in details:
                del details[key]

    return race_data

def process_season_races(summary_data, year, race_counter):
    """
    Elabora i dati delle gare dal summary della stagione e recupera i dettagli completi
    """
    races_data = []
    
    # Naviga nella struttura del JSON per trovare le gare
    stage = summary_data.get("stage", {})
    stages = stage.get("stages", [])
    
    if not stages:
        print(f"    Nessuna gara trovata nella struttura stages per l'anno {year}")
        return races_data, race_counter
    
    print(f"    Trovate {len(stages)} gare nella stagione {year}")
    
    for race_stage in stages:
        race_id = race_stage.get("id")
        if not race_id:
            print(f"      ✗ ID gara mancante per una gara")
            continue
            
        print(f"      Recuperando dettagli completi per la gara {race_counter}...")
        race_details = fetch_race_details(race_id)
        
        if not race_details:
            print(f"      ✗ Impossibile recuperare i dettagli per la gara {race_counter}")
            continue
            
        # Unisci i dati base con i dettagli completi
        race_info = {
            "id": str(race_counter),  # ID numerico progressivo
            "stage_id": race_id,
            "description": race_stage.get("description", "Unknown Race"),
            "scheduled": race_stage.get("scheduled"),
            "scheduled_end": race_stage.get("scheduled_end"),
            "status": race_stage.get("status"),
            "type": race_stage.get("type"),
            "single_event": race_stage.get("single_event"),
            "venue": race_stage.get("venue", {}),
            "unique_stage_id": race_stage.get("unique_stage_id"),
            "stages": race_stage.get("stages", []),
            "sport_event_context": race_stage.get("sport_event_context", {}),
            "competitors": race_stage.get("competitors", []),
            "sport_event_status": race_stage.get("sport_event_status", {}),
            "race_result": race_stage.get("race_result", {}),
            "statistics": race_stage.get("statistics", {}),
            "complete_details": race_details
        }
        
        races_data.append(clean_race_data(race_info))
        print(f"      ✓ Processata gara {race_counter}: {race_info['description']}")
        
        race_counter += 1
        # Pausa tra le richieste per evitare rate limiting
        time.sleep(1)
    
    return races_data, race_counter

def save_season_races(year, season_id, description, races_data, season_summary):
    """
    Salva i dati delle gare di una stagione in un file separato
    """
    filename = f"Data/extracted/season_{year}.json"
    try:
        output_data = {
            "id": year,
            "season_id": season_id,
            "description": description,
            "total_races": len(races_data),
            "generated_at": season_summary.get("generated_at"),
            "season_info": {
                "id": season_summary.get("stage", {}).get("id"),
                "description": season_summary.get("stage", {}).get("description"),
                "scheduled": season_summary.get("stage", {}).get("scheduled"),
                "scheduled_end": season_summary.get("stage", {}).get("scheduled_end"),
                "type": season_summary.get("stage", {}).get("type"),
                "category": season_summary.get("stage", {}).get("category"),
                "sport": season_summary.get("stage", {}).get("sport")
            },
            "races": races_data
        }
        
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=4, ensure_ascii=False)
        print(f"    ✓ Salvate {len(races_data)} gare per il {year} in {filename}")
    except IOError as e:
        print(f"    ✗ Errore durante il salvataggio di {filename}: {e}")

def main():
    print("=== Estrattore Gare IndyCar ===\n")
    
    # Carica la lista delle stagioni
    print("1. Caricamento lista stagioni...")
    seasons = load_seasons()
    if not seasons:
        print("Nessuna stagione trovata. Uscita.")
        return
    
    print(f"\n2. Processamento di {len(seasons)} stagioni...")
    
    # Processa ogni stagione
    for season_idx, season in enumerate(seasons, 1):
        year = season["year"]
        season_id = season["season_id"]
        
        # Reset del contatore delle gare per ogni anno
        race_counter = 1
            
        print(f"\n--- [{season_idx}/{len(seasons)}] Processando stagione {year} ---")
        print(f"    Season ID: {season_id}")
        print(f"    Descrizione: {season['description']}")
        
        # Recupera il sommario completo della stagione
        print(f"    Recuperando summary per stagione {year}...")
        season_summary = fetch_data(f"{BASE_URL}/sport_events/{season_id}/summary.json")
        if not season_summary:
            print(f"✗ Nessun dato trovato per la stagione {year}")
            continue
        
        # Elabora i dati delle gare dal summary
        print(f"    Elaborando dati delle gare...")
        races_data, _ = process_season_races(season_summary, year, race_counter)
        
        # Salva i dati della stagione
        if races_data:
            save_season_races(year, season_id, season["description"], races_data, season_summary)
        else:
            print(f"    ✗ Nessuna gara trovata per la stagione {year}")
        
        # Pausa tra le stagioni per evitare rate limiting
        if season_idx < len(seasons):
            print(f"    Pausa di 2 secondi prima della prossima stagione...")
            time.sleep(2)
    
    print("\n=== Estrazione gare completata ===")

if __name__ == "__main__":
    main() 