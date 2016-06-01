var mongoose = require('mongoose');

var StringSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true }
});

module.exports = mongoose.model('String', StringSchema);