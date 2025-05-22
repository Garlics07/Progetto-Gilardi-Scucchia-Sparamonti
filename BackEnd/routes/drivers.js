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

// Endpoint per ottenere i dati della homepage (stagione 2025)
router.get('/homepage/2025', async (req, res) => {
    try {
        const db = await connessioneDb();
        const collection = db.collection('races');

        // Ottieni il leader della classifica 2025
        const leader2025 = await collection.aggregate([
            { $match: { season_year: "2025" } },
            { $unwind: "$drivers" },
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
                    }
                }
            },
            { $sort: { punti_totali: -1 } },
            { $limit: 1 }
        ]).toArray();

        // Ottieni i top 10 piloti del 2025 ordinati per punti
        const topDrivers2025 = await collection.aggregate([
            { $match: { season_year: "2025" } },
            { $unwind: "$drivers" },
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
                    }
                }
            },
            { $sort: { punti_totali: -1, vittorie: -1, podi: -1 } }, // Ordina prima per punti, poi per vittorie, infine per podi
            { $limit: 10 }
        ]).toArray();

        // Calcola il pilota favorito considerando tutte le stagioni
        const favoriteDriver = await collection.aggregate([
            { $unwind: "$drivers" },
            {
                $group: {
                    _id: "$drivers.driver_id",
                    nome: { $first: "$drivers.name" },
                    numero_auto: { $first: "$drivers.car_number" },
                    vittorie_totali: {
                        $sum: {
                            $cond: [{ $eq: ["$drivers.position", 1] }, 1, 0]
                        }
                    },
                    podi_totali: {
                        $sum: {
                            $cond: [{ $lte: ["$drivers.position", 3] }, 1, 0]
                        }
                    },
                    gare_totali: { $sum: 1 },
                    punti_2025: {
                        $sum: {
                            $cond: [
                                { $eq: ["$season_year", "2025"] },
                                "$drivers.points",
                                0
                            ]
                        }
                    },
                    vittorie_2025: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ["$season_year", "2025"] },
                                    { $eq: ["$drivers.position", 1] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $addFields: {
                    win_rate: {
                        $multiply: [
                            { $divide: ["$vittorie_totali", "$gare_totali"] },
                            100
                        ]
                    },
                    podium_rate: {
                        $multiply: [
                            { $divide: ["$podi_totali", "$gare_totali"] },
                            100
                        ]
                    }
                }
            },
            {
                $addFields: {
                    victory_probability: {
                        $add: [
                            { $multiply: ["$win_rate", 0.4] },
                            { $multiply: ["$podium_rate", 0.3] },
                            { $multiply: ["$punti_2025", 0.2] },
                            { $multiply: ["$vittorie_2025", 0.1] }
                        ]
                    }
                }
            },
            { $sort: { victory_probability: -1 } },
            { $limit: 1 }
        ]).toArray();

        // Ottieni tutte le gare del 2025 ordinate per data
        const allRaces2025 = await collection.aggregate([
            { $match: { season_year: "2025" } },
            { $sort: { scheduled: 1 } }
        ]).toArray();

        // Trova la prossima gara
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        console.log('Data attuale (mezzanotte):', now.toISOString());

        const nextRace = allRaces2025.find(race => {
            const raceDate = new Date(race.scheduled);
            raceDate.setHours(0, 0, 0, 0);
            return raceDate > now;
        });

        console.log('Prossima gara trovata:', nextRace?.description, nextRace?.scheduled);

        // Se non ci sono gare future, usa la prima gara del 2025
        const raceToShow = nextRace || allRaces2025[0];
        console.log('Gara da mostrare:', raceToShow?.description, raceToShow?.scheduled);

        res.json({
            leader: leader2025[0] || null,
            topDrivers: topDrivers2025,
            favoriteDriver: {
                _id: favoriteDriver[0]?._id,
                nome: favoriteDriver[0]?.nome,
                vittorie_totali: favoriteDriver[0]?.vittorie_totali,
                podi_totali: favoriteDriver[0]?.podi_totali,
                victory_probability: favoriteDriver[0]?.victory_probability
            } || null,
            nextRace: raceToShow || null
        });
    } catch (error) {
        console.error('Errore nel recupero dei dati della homepage:', error);
        res.status(500).json({ error: 'Errore nel recupero dei dati della homepage' });
    }
});

export default router; 