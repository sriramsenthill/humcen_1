const mongoose = require('mongoose');

const consultation = new mongoose.Schema({
  userID: {
    type: Number,
  },
  service: {
    type: String,
  },
  email: {
    type: String,
  },
  meeting_date_time: {
    type: Date,
  },
});

const Consultation = mongoose.model('Consultation', consultation,"patent_consultation");

module.exports = Consultation;