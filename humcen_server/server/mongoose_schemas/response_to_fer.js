const mongoose = require('mongoose');

const responseToFerSchema = new mongoose.Schema({
  _id: {
    job_no: {
        type: Number,
      },
  },
  field: {
    type: String,
    
  },
  fer: {
    type: Object,

  },
  complete_specifications: {
    type: Object,

  },
  response_strategy: {
    type: String,

  },
  userID: {
    type: Number,
  },
  country: {
    type: String,
  }
});

const ResponseToFerModel = mongoose.model('ResponseToFer', responseToFerSchema, 'response_to_fer');

module.exports = ResponseToFerModel;
