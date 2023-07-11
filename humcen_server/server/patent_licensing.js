const mongoose = require('mongoose');

const patentLicensingSchema = new mongoose.Schema({
  _id: {
    job_no: {
      type: Number,
    }
  },
  field: {
    type: String,
  },
  patent_information: {
    type: String,
  },
  commercialization_goals: {
    type: String,
  },
  competitive_landscape: {
    type: String,
  },
  technology_description: {
    type: String,
  },
  userID: {
    type: Number,
  },
  country: {
    type: String,
  },
});

const patentLicensingModel = mongoose.model('PatentLicensing', patentLicensingSchema, 'patent_licensing_and_commercialization_services');

module.exports = patentLicensingModel;
