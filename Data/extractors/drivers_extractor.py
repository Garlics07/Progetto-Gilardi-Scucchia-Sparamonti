import json
from pathlib import Path
from typing import List, Dict, Any
from collections import defaultdict

class DriversExtractor:
    def __init__(self):
        self.data_dir = Path("data")
        self.output_file = self.data_dir / "drivers.json"
        self.drivers_by_id = defaultdict(dict)

    def load_season_files(self) -> List[Dict[str, Any]]:
        """Carica tutti i file delle stagioni dalla cartella data"""
        print("\nRicerca file stagioni in data/...")
        season_files = sorted(self.data_dir.glob("season_*.json"))
        
        if not season_files:
            print("! Nessun file stagione trovato nella cartella data/")
            return []
        
        print(f"Trovati {len(season_files)} file stagioni")
        seasons_data = []
        
        for file in season_files:
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    seasons_data.append(data)
                print(f"✓ Caricato {file.name}")
                # Debug: mostra la struttura del file
                print(f"  - Anno: {data.get('id')}")
                print(f"  - Numero gare: {len(data.get('races', []))}")
            except Exception as e:
                print(f"✗ Errore nel caricamento di {file.name}: {e}")
        
        return seasons_data

    def extract_driver_info(self, competitor: Dict[str, Any]) -> Dict[str, Any]:
        """Estrae le informazioni base di un pilota"""
        driver_info = {
            "id": competitor.get("id"),
            "name": competitor.get("name"),
            "gender": competitor.get("gender"),
            "nationality": competitor.get("nationality"),
            "country_code": competitor.get("country_code")
        }
        
        # Debug: mostra i dati estratti
        print(f"  Estrazione pilota: {driver_info['name']} (ID: {driver_info['id']})")
        return driver_info

    def update_driver_info(self, driver_info: Dict[str, Any]) -> None:
        """Aggiorna le informazioni di un pilota mantenendo i dati più completi"""
        driver_id = driver_info["id"]
        if not driver_id:
            print("! ID pilota mancante")
            return

        current_info = self.drivers_by_id[driver_id]
        for key, value in driver_info.items():
            if value and (key not in current_info or not current_info[key]):
                current_info[key] = value

    def process_season(self, season: Dict[str, Any]) -> None:
        """Processa una singola stagione per estrarre i piloti"""
        year = season.get("id")
        if not year:
            print("! Anno mancante in una stagione")
            return

        print(f"\nProcessando stagione {year}")
        races = season.get("races", [])
        print(f"Trovate {len(races)} gare")

        for race_idx, race in enumerate(races, 1):
            print(f"\nGara {race_idx}:")
            print(f"  ID: {race.get('id')}")
            print(f"  Descrizione: {race.get('description')}")
            
            # Cerca i piloti in complete_details.competitors
            complete_details = race.get("complete_details", {})
            if not complete_details:
                print("  ! Nessun complete_details trovato")
                continue
                
            competitors = complete_details.get("competitors", [])
            print(f"  Trovati {len(competitors)} piloti")
            
            if not competitors:
                print("  ! Nessun pilota trovato in questa gara")
                continue
            
            for competitor in competitors:
                driver_info = self.extract_driver_info(competitor)
                self.update_driver_info(driver_info)

    def save_drivers_data(self) -> None:
        """Salva i dati dei piloti in un file JSON"""
        try:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            
            final_drivers = list(self.drivers_by_id.values())
            if not final_drivers:
                print("! Nessun pilota trovato da salvare")
                return
                
            with open(self.output_file, "w", encoding="utf-8") as f:
                json.dump(final_drivers, f, indent=4, ensure_ascii=False)
            
            print(f"\n✓ Salvati dati di {len(final_drivers)} piloti in {self.output_file}")
            
            if self.output_file.exists():
                print(f"✓ File creato con successo")
                print(f"  Dimensione: {self.output_file.stat().st_size} bytes")
                # Debug: mostra il primo pilota salvato
                print("\nEsempio di pilota salvato:")
                print(json.dumps(final_drivers[0], indent=2, ensure_ascii=False))
            else:
                print(f"! Errore: file non creato")
                
        except Exception as e:
            print(f"✗ Errore durante il salvataggio dei dati: {e}")

    def print_statistics(self) -> None:
        """Stampa le statistiche sui piloti estratti"""
        final_drivers = list(self.drivers_by_id.values())
        
        if not final_drivers:
            print("\n! Nessun pilota trovato")
            return
            
        print("\n=== Statistiche Finali ===")
        print(f"Totale piloti unici: {len(final_drivers)}")
        
        # Statistiche per nazionalità
        nationalities = defaultdict(int)
        for driver in final_drivers:
            country = driver.get("nationality", "Unknown")
            nationalities[country] += 1
        
        print("\nPiloti per nazionalità:")
        for country, count in sorted(nationalities.items(), key=lambda x: x[1], reverse=True):
            print(f"- {country}: {count}")

    def run(self) -> None:
        """Esegue il processo completo di estrazione"""
        print("=== Estrattore Dati Piloti IndyCar ===\n")
        
        # Carica i dati delle stagioni
        seasons_data = self.load_season_files()
        if not seasons_data:
            print("Nessun dato stagionale trovato. Uscita.")
            return
        
        # Processa ogni stagione
        for season in seasons_data:
            self.process_season(season)
        
        # Salva i dati
        self.save_drivers_data()
        
        # Stampa statistiche
        self.print_statistics()

def main():
    extractor = DriversExtractor()
    extractor.run()

if __name__ == "__main__":
    main() 