const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    userID: {
        type: Number
    },
    _id:{
        job_no:{
            type:Number,
        }
    },
  field: {
    type: String,
  },
  invention_description: {
    type: String,
  },
  technical_diagram: {
    type: Object
  },
  keywords: {
    type: [String],
  },
  country: {
    type: String,
  },
});

const Search = mongoose.model('Search', searchSchema, 'patent_search');
module.exports = Search;
