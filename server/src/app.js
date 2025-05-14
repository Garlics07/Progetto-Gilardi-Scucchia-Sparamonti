const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const teamRoutes = require('./routes/teams');
const playerRoutes = require('./routes/players');
const matchRoutes = require('./routes/matches');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Sport Analytics API' });
});

module.exports = app; 