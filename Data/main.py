import os
import sys
from pathlib import Path

# Aggiungi la directory corrente al path per importare i moduli
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from extractors.seasons_extractor import main as extract_seasons
from extractors.races_extractor import main as extract_races
from extractors.drivers_extractor import main as extract_drivers
from mongodb_adapter import create_mongodb_collections

def run_all_extractors():
    """
    Esegue tutti gli estrattori in sequenza
    """
    print("=== Avvio estrazione completa dati IndyCar ===\n")
    
    # 1. Estrazione stagioni
    print("\n[1/4] Estrazione stagioni...")
    extract_seasons()
    
    # Verifica se il file delle stagioni è stato creato
    if not Path("Data/extracted/seasons.json").exists():
        print("✗ Estrazione stagioni fallita. Uscita.")
        return
    
    # 2. Estrazione gare
    print("\n[2/4] Estrazione gare...")
    extract_races()
    
    # Verifica se sono stati creati i file delle gare
    season_files = list(Path("Data/extracted").glob("season_*.json"))
    if not season_files:
        print("✗ Estrazione gare fallita. Uscita.")
        return
    
    # 3. Estrazione piloti
    print("\n[3/4] Estrazione piloti...")
    extract_drivers()
    
    # 4. Caricamento in MongoDB
    print("\n[4/4] Caricamento dati in MongoDB...")
    create_mongodb_collections()
    
    print("\n=== Estrazione e caricamento completati ===")

def print_usage():
    """
    Stampa le istruzioni di utilizzo
    """
    print("""
Utilizzo:
    python main.py [opzione]

Opzioni:
    all     - Esegue tutti gli estrattori in sequenza e carica i dati in MongoDB
    seasons - Esegue solo l'estrattore delle stagioni
    races   - Esegue solo l'estrattore delle gare
    drivers - Esegue solo l'estrattore dei piloti
    mongodb - Carica i dati estratti in MongoDB
    help    - Mostra questo messaggio

Esempio:
    python main.py all
    """)

def main():
    # Crea la directory data se non esiste
    Path("Data/extracted").mkdir(parents=True, exist_ok=True)
    
    # Gestione degli argomenti da linea di comando
    if len(sys.argv) != 2 or sys.argv[1] == "help":
        print_usage()
        return
    
    option = sys.argv[1].lower()
    
    if option == "all":
        run_all_extractors()
    elif option == "seasons":
        extract_seasons()
    elif option == "races":
        extract_races()
    elif option == "drivers":
        extract_drivers()
    elif option == "mongodb":
        create_mongodb_collections()
    else:
        print(f"✗ Opzione non valida: {option}")
        print_usage()

if __name__ == "__main__":
    main() 