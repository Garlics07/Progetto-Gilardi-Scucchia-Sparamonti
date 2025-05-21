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
            
            // Ordina per punti totali in ordine decrescente
            { $sort: { punti_totali: -1 } }
        ]).toArray();

        res.json(drivers);
    } catch (error) {
        console.error('Errore nel recupero dei piloti:', error);
        res.status(500).json({ error: 'Errore nel recupero dei piloti' });
    }
});

export default router; 