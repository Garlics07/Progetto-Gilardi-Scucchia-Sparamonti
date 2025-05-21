import express from 'express';
import { connessioneDb } from '../db.js';

const router = express.Router();

// Endpoint per ottenere tutti i piloti con i loro punti totali
router.get('/', async (req, res) => {
    try {
        const db = await connessioneDb();
        const collection = db.collection('races');

        const drivers = await collection.aggregate([
            // Unwind dell'array dei piloti per ogni gara
            { $unwind: "$drivers" },
            
            // Raggruppa per pilota
            {
                $group: {
                    _id: "$drivers.driver_id",
                    nome: { $first: "$drivers.name" },
                    numero_auto: { $first: "$drivers.car_number" },
                    punti_totali: { $sum: "$drivers.points" },
                    vittorie: {
                        $sum: {
                            $cond: [{ $eq: ["$drivers.position", 1] }, 1, 0]
                        }
                    },
                    podi: {
                        $sum: {
                            $cond: [{ $lte: ["$drivers.position", 3] }, 1, 0]
                        }
                    },
                    gare_disputate: { $sum: 1 }
                }
            },
            
            // Rimuovi la virgola dal nome
            {
                $addFields: {
                    nome: { $replaceAll: { input: "$nome", find: ",", replacement: " " } }
                }
            },
            
            // Ordina per punti totali in ordine decrescente
            { $sort: { punti_totali: -1 } }
        ]).toArray();

        res.json(drivers);
    } catch (error) {
        console.error('Errore nel recupero dei piloti:', error);
        res.status(500).json({ error: 'Errore nel recupero dei piloti' });
    }
});

// Endpoint per ottenere i dettagli di un pilota specifico
router.get('/:driverId', async (req, res) => {
    try {
        const db = await connessioneDb();
        const collection = db.collection('races');
        const driverId = req.params.driverId;

        // Ottieni i dettagli generali del pilota
        const driverDetails = await collection.aggregate([
            { $unwind: "$drivers" },
            { $match: { "drivers.driver_id": driverId } },
            {
                $group: {
                    _id: "$drivers.driver_id",
                    nome: { $first: "$drivers.name" },
                    numero_auto: { $first: "$drivers.car_number" },
                    punti_totali: { $sum: "$drivers.points" },
                    vittorie: {
                        $sum: {
                            $cond: [{ $eq: ["$drivers.position", 1] }, 1, 0]
                        }
                    },
                    podi: {
                        $sum: {
                            $cond: [{ $lte: ["$drivers.position", 3] }, 1, 0]
                        }
                    },
                    gare_disputate: { $sum: 1 }
                }
            }
        ]).toArray();

        if (driverDetails.length === 0) {
            return res.status(404).json({ error: 'Pilota non trovato' });
        }

        // Ottieni lo storico delle gare
        const raceHistory = await collection.aggregate([
            { $unwind: "$drivers" },
            { $match: { "drivers.driver_id": driverId } },
            {
                $project: {
                    race_id: "$_id",
                    description: 1,
                    date: "$scheduled_end",
                    status: 1,
                    venue: 1,
                    position: "$drivers.position",
                    points: "$drivers.points",
                    scheduled: 1,
                    scheduled_end: 1
                }
            },
            // Filtra la gara in corso
            {
                $match: {
                    $expr: {
                        $not: {
                            $and: [
                                { $lte: ["$scheduled", new Date()] },
                                { $gte: ["$scheduled_end", new Date()] }
                            ]
                        }
                    }
                }
            }
        ]).toArray();

        // Formatta la risposta
        const response = {
            ...driverDetails[0],
            nome: driverDetails[0].nome.replace(/,/g, ' '),
            race_history: raceHistory.map(race => ({
                race_id: race.race_id,
                description: race.description,
                scheduled: race.scheduled,
                scheduled_end: race.scheduled_end,
                status: race.status,
                venue: {
                    name: race.venue.name,
                    city: race.venue.city,
                    country: race.venue.country
                },
                position: race.position === 'Non presente' ? null : Number(race.position),
                points: race.points || 0
            }))
        };

        res.json(response);
    } catch (error) {
        console.error('Errore nel recupero dei dettagli del pilota:', error);
        res.status(500).json({ error: 'Errore nel recupero dei dettagli del pilota' });
    }
});

export default router; 