const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: String,
  founded: Number,
  stadium: String,
  coach: String,
});

module.exports = mongoose.model('Team', teamSchema); 