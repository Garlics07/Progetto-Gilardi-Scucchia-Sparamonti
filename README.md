# Piattaforma SportAnalytics

Una piattaforma completa di analisi sportiva che fornisce approfondimenti basati sui dati per allenatori, analisti e appassionati.

## Caratteristiche Principali

- Visualizzazione in tempo reale dei dati sportivi
- Analisi delle prestazioni dei giocatori
- Algoritmi di previsione delle partite
- Raccolta automatizzata dei dati da varie fonti
- Dashboard interattiva per l'esplorazione dei dati

## Stack Tecnologico

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MongoDB
- Raccolta Dati: Python

## Struttura del Progetto

```
sport-analytics/
├── FrontEnd/          # Applicazione React frontend
├── BackEnd/          # Server Node.js backend
├── Data/             # Script Python per l'estrazione dei dati e l'inserimento in MongoDB
│   ├── extracted/    # Directory dove vengono salvati i file JSON estratti
│   └── mongodb/      # Directory per i file JSON adattati per MongoDB
├── documentation/    # Documentazione del progetto
└── requirements.txt  # Dipendenze Python
```

## Requisiti di Sistema

### Prerequisiti

- Node.js (versione LTS consigliata)
- MongoDB
- Python 3.x
- npm o yarn

### Dipendenze Python
- requests==2.31.0
- pymongo==4.6.1
- python-dateutil==2.8.2

## Installazione

1. Clonare il repository:
```bash
git clone [URL_REPOSITORY]
```

2. Installare le dipendenze frontend:
```bash
cd FrontEnd
npm install
```

3. Installare le dipendenze backend:
```bash
cd BackEnd
npm install
```

4. Installare le dipendenze Python:
```bash
pip install -r requirements.txt
```

## Configurazione

1. Configurare il file `.env` nel backend con le credenziali del database
2. Assicurarsi che MongoDB sia in esecuzione
3. Avviare i servizi necessari

## Connessioni e API

### Database MongoDB
Il progetto utilizza MongoDB Atlas come database cloud. La connessione è configurata nel file `Data/mongodb_adapter.py`:

```python
connection_string = "mongodb+srv://marcogilardi:Garlics2007@cluster0.fixb6bi.mongodb.net/"
```

### API SportRadar
Il progetto utilizza l'API di SportRadar per la raccolta dei dati sportivi. Le credenziali API sono configurate nel file `Data/api_config.py`:

```python
API_KEY = "Gm4DxN7Erj41awJRh7BldXmEqDl0AYef0dfHlSaF"
BASE_URL = "https://api.sportradar.com/indycar/trial/v1/en"
```

Per ottenere una chiave API:
1. Registrarsi su [SportRadar Developer Portal](https://developer.sportradar.com/)
2. Sottoscrivere il piano Trial per IndyCar
3. Generare una nuova chiave API
4. Inserire la chiave nel file di configurazione

## Avvio del Progetto

1. Avviare il backend:
```bash
cd BackEnd
npm start
```

2. Avviare il frontend:
```bash
cd FrontEnd
npm start
```

3. Avviare lo script di raccolta dati:
```bash
cd Data
python main.py
```

## Contribuire

Le pull request sono benvenute. Per modifiche importanti, aprire prima un issue per discutere cosa vorreste cambiare.

## Licenza

[MIT](https://choosealicense.com/licenses/mit/)
