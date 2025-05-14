const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  position: String,
  age: Number,
  nationality: String,
  stats: {
    speed: Number,
    shooting: Number,
    passing: Number,
    defense: Number,
    physical: Number,
    goals: Number,
    assists: Number,
    appearances: Number,
    minutesPlayed: Number,
  },
});

module.exports = mongoose.model('Player', playerSchema); 