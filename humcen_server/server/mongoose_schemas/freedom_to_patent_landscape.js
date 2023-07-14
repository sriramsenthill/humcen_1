const mongoose = require('mongoose');

const patentLandscapeSchema = new mongoose.Schema({
  _id: {
    job_no: {
      type: Number,
    }
  },
  field: {
    type: String,
  },
  technology_description: {
    type: String,
  },
  keywords: {
    type: String,
  },
  competitor_information: {
    type: String,
  },
  userID: {
    type: Number,
  }, 
  country: {
    type: String,
  },
});

const patentLandscapeModel = mongoose.model('FreedomToPatentLandscape', patentLandscapeSchema, 'freedom_to_patent_landscape');

module.exports = patentLandscapeModel;
