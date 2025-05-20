import os
import sys
from pathlib import Path

# Aggiungi la directory corrente al path per importare i moduli
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from extractors.seasons_extractor import main as extract_seasons
from extractors.races_extractor import main as extract_races
from extractors.drivers_extractor import main as extract_drivers

def run_all_extractors():
    """
    Esegue tutti gli estrattori in sequenza
    """
    print("=== Avvio estrazione completa dati IndyCar ===\n")
    
    # 1. Estrazione stagioni
    print("\n[1/3] Estrazione stagioni...")
    extract_seasons()
    
    # Verifica se il file delle stagioni è stato creato
    if not Path("data/seasons.json").exists():
        print("✗ Estrazione stagioni fallita. Uscita.")
        return
    
    # 2. Estrazione gare
    print("\n[2/3] Estrazione gare...")
    extract_races()
    
    # Verifica se sono stati creati i file delle gare
    season_files = list(Path("data").glob("season_*.json"))
    if not season_files:
        print("✗ Estrazione gare fallita. Uscita.")
        return
    
    # 3. Estrazione piloti
    print("\n[3/3] Estrazione piloti...")
    extract_drivers()
    
    print("\n=== Estrazione completa terminata ===")

def print_usage():
    """
    Stampa le istruzioni di utilizzo
    """
    print("""
Utilizzo:
    python main.py [opzione]

Opzioni:
    all     - Esegue tutti gli estrattori in sequenza
    seasons - Esegue solo l'estrattore delle stagioni
    races   - Esegue solo l'estrattore delle gare
    drivers - Esegue solo l'estrattore dei piloti
    help    - Mostra questo messaggio

Esempio:
    python main.py all
    """)

def main():
    # Crea la directory data se non esiste
    Path("data").mkdir(parents=True, exist_ok=True)
    
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
    else:
        print(f"✗ Opzione non valida: {option}")
        print_usage()

if __name__ == "__main__":
    main() 