# Piattaforma SportAnalytics

Una piattaforma completa di analisi sportiva che fornisce approfondimenti basati sui dati per allenatori, analisti e appassionati.

## Caratteristiche Principali

- Visualizzazione dei dati sportivi
- Analisi delle prestazioni dei piloti
- Algoritmi di previsione delle gare
- Raccolta automatizzata dei dati da varie fonti
- Dashboard interattiva per l'esplorazione dei dati

## Stack Tecnologico

- Frontend: React Vite
- Backend: Node.js + Express
- Database: MongoDB
- Raccolta Dati: Python

## Requisiti di Sistema

### Prerequisiti

- Node.js (versione LTS consigliata)
- MongoDB
- Python 3.x
- npm

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
npm install react-router-dom
```

3. Installare le dipendenze backend:
```bash
cd BackEnd
npm install
npm i nodemon -D
npm i express
npm i cors
```

4. Installare le dipendenze Python:
```bash
pip install -r requirements.txt
```

## Configurazione

1. Configurare il file `.env` nel backend con le credenziali del database
2. Assicurarsi che MongoDB sia in esecuzione
3. Avviare i servizi necessari

## Avvio del Progetto

1. Avviare il backend:
```bash
cd BackEnd
npm start
```

2. Avviare il frontend:
```bash
cd FrontEnd
npm run dev
```

3. Avviare lo script di raccolta dati:
```bash
cd Data
python main.py
```

[MIT](https://choosealicense.com/licenses/mit/)
