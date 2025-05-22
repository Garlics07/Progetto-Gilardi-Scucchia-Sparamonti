import express from 'express';
import { connessioneDb } from '../db.js';

const router = express.Router();

// Funzione per determinare lo stato della gara
const determineRaceStatus = (race) => {
    const now = new Date();
    const scheduledStart = new Date(race.scheduled);
    const scheduledEnd = new Date(race.scheduled_end);

    // Se la gara è già stata completata o cancellata, mantieni il suo stato originale
    if (race.status === 'Finished' || race.status === 'Cancelled' || race.status === 'Closed') {
        return race.status;
    }

    // Se la gara è in corso (con un margine di 24 ore prima e dopo)
    const oneDayBefore = new Date(scheduledStart.getTime() - 24 * 60 * 60 * 1000);
    const oneDayAfter = new Date(scheduledEnd.getTime() + 24 * 60 * 60 * 1000);
    
    if (now >= oneDayBefore && now <= oneDayAfter) {
        console.log(`Gara in corso trovata: ${race.description} (${scheduledStart.toISOString()} - ${scheduledEnd.toISOString()})`);
        return 'Open';
    }

    // Se la gara è nel futuro
    if (now < scheduledStart) {
        return 'Scheduled';
    }

    // Se la gara è nel passato ma non ha uno stato specifico
    return 'Closed';
};

// Funzione per ordinare le gare
const sortRaces = (races) => {
    // Separiamo le gare per stato
    const openRaces = races.filter(race => race.status === 'Open');
    const scheduledRaces = races.filter(race => race.status === 'Scheduled');
    const finishedRaces = races.filter(race => race.status === 'Finished');
    const cancelledRaces = races.filter(race => race.status === 'Cancelled' || race.status === 'Closed');

    // Funzione per ordinare per data (crescente per Open e Scheduled, decrescente per gli altri)
    const sortByDate = (races, ascending = true) => {
        return races.sort((a, b) => {
            const dateA = new Date(a.scheduled);
            const dateB = new Date(b.scheduled);
            return ascending ? dateA - dateB : dateB - dateA;
        });
    };

    // Ordina ogni gruppo
    const sortedOpenRaces = sortByDate(openRaces, true);      // Ordine crescente per gare in corso
    const sortedScheduledRaces = sortByDate(scheduledRaces, true);  // Ordine crescente per gare da fare
    const sortedFinishedRaces = sortByDate(finishedRaces, false);   // Ordine decrescente per gare finite
    const sortedCancelledRaces = sortByDate(cancelledRaces, false); // Ordine decrescente per gare cancellate

    // Combina i gruppi nell'ordine richiesto
    const finalSorted = [
        ...sortedOpenRaces,      // Prima le gare in corso
        ...sortedScheduledRaces, // Poi le gare da fare
        ...sortedFinishedRaces,  // Poi le gare finite
        ...sortedCancelledRaces  // Infine le gare cancellate
    ];

    // Log dell'ordine finale
    console.log('\nOrdine finale delle gare:');
    finalSorted.forEach((race, index) => {
        console.log(`${index + 1}. ${race.description} - Stato: ${race.status} - Data: ${new Date(race.scheduled).toISOString()}`);
    });

    return finalSorted;
};

// Endpoint per ottenere il calendario delle gare
router.get('/', async (req, res) => {
    try {
        const db = await connessioneDb();
        const collection = db.collection('races');

        console.log('\nRecupero gare dal database...');
        const races = await collection.aggregate([
            // Proietta solo i campi necessari
            {
                $project: {
                    _id: 1,
                    race_id: 1,
                    description: 1,
                    scheduled: 1,
                    scheduled_end: 1,
                    status: 1,
                    venue: {
                        name: 1,
                        city: 1,
                        country: 1,
                        length: 1,
                        curves_left: 1,
                        curves_right: 1
                    },
                    season_year: 1
                }
            }
        ]).toArray();

        console.log(`Trovate ${races.length} gare nel database`);

        // Applica la logica di determinazione dello stato a ogni gara
        const processedRaces = races.map(race => ({
            ...race,
            status: determineRaceStatus(race)
        }));

        // Conta gli stati
        const statusCounts = processedRaces.reduce((acc, race) => {
            acc[race.status] = (acc[race.status] || 0) + 1;
            return acc;
        }, {});
        console.log('\nDistribuzione stati:', statusCounts);

        // Ordina le gare secondo la logica definita
        const sortedRaces = sortRaces(processedRaces);

        res.json(sortedRaces);
    } catch (error) {
        console.error('Errore nel recupero del calendario:', error);
        res.status(500).json({ error: 'Errore nel recupero del calendario' });
    }
});

export default router; 