import requests
import json
from pathlib import Path
import re
import time
import os
from dotenv import load_dotenv

# Carica le variabili d'ambiente dal file .env nella root
root_dir = Path(__file__).parent.parent.parent
load_dotenv(root_dir / ".env")

# Configurazione API
BASE_URL = os.getenv("SPORTRADAR_BASE_URL", "https://api.sportradar.com/indycar/trial/v2/en")
API_KEY = os.getenv("SPORTRADAR_API_KEY")

# Crea la directory per i dati estratti
Path("Data/extracted").mkdir(parents=True, exist_ok=True)

HEADERS = {
    "accept": "application/json",
    "x-api-key": API_KEY
}

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

def fetch_seasons():
    """
    Recupera la lista delle stagioni disponibili
    """
    url = f"{BASE_URL}/seasons.json"
    data = fetch_data(url)
    if not data:
        return []
    
    seasons = data.get("stages", [])
    processed_seasons = []
    
    for season in seasons:
        description = season.get("description", "")
        # Estrai l'anno dalla descrizione
        year_match = re.search(r'\b(20\d{2})\b', description)
        if year_match:
            year = year_match.group(1)
            processed_seasons.append({
                "id": year,  # Usa l'anno come ID
                "season_id": season["id"],
                "description": description,
                "year": year
            })
    
    return processed_seasons

def save_seasons_list(seasons):
    """
    Salva la lista delle stagioni in un file separato
    """
    seasons_data = []
    for season in seasons:
        seasons_data.append({
            "id": season["id"],
            "year": season["year"],
            "description": season["description"],
            "season_id": season["season_id"]
        })
    
    try:
        with open("Data/extracted/seasons.json", "w", encoding="utf-8") as f:
            json.dump(seasons_data, f, indent=4, ensure_ascii=False)
        print("✓ Lista stagioni salvata in Data/extracted/seasons.json")
    except IOError as e:
        print(f"✗ Errore durante il salvataggio di seasons.json: {e}")

def main():
    print("=== Estrattore Stagioni IndyCar ===\n")
    
    # Recupera la lista delle stagioni
    print("1. Recupero lista stagioni...")
    seasons = fetch_seasons()
    if not seasons:
        print("Nessuna stagione trovata. Uscita.")
        return
    
    # Filtra le stagioni per il range 2017-2025
    filtered_seasons = [s for s in seasons if 2017 <= int(s["year"]) <= 2025]
    if not filtered_seasons:
        print("Nessuna stagione trovata nel range 2017-2025. Uscita.")
        return
    
    # Salva la lista delle stagioni
    save_seasons_list(filtered_seasons)
    
    print("\n=== Estrazione stagioni completata ===")
    print(f"Trovate {len(filtered_seasons)} stagioni nel range 2017-2025")

if __name__ == "__main__":
    main() 