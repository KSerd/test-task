const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PrepositionSchema = new Schema({
  articleUrl: { type: String, required: true},
  originalText: { type: String, required: true},
  usersText: { type: String, required: true },
  isApproved: Boolean,
});

let Preposition = mongoose.model('Preposition', PrepositionSchema);

module.exports = Preposition;